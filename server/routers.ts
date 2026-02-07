import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllSiteSettings, getSiteSetting, upsertSiteSetting, initializeDefaultSettings, getLandingPageSetting, getAllLandingPageSettings, upsertLandingPageSetting, getAllCtaButtons, getDefaultCtaButton, getCtaButton, createCtaButton, updateCtaButton, deleteCtaButton, setDefaultCtaButton, getAllMarketingAngles, getMarketingAngle, createMarketingAngle, updateMarketingAngle, deleteMarketingAngle, initializeDefaultMarketingAngles, getAllColorSchemes, getColorSchemeBySlug, createColorScheme, updateColorScheme, deleteColorScheme, initDefaultColorSchemes } from "./db";
import { validateEventPage, validateAllPages, type ComplianceResult } from "./validation";
import { autoFixMissingElements, regenerateContentForAngle } from "./contentGeneration";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Landing page settings API
  landingPages: router({
    // Get all landing page settings
    getAll: publicProcedure.query(async () => {
      return getAllLandingPageSettings();
    }),

    // Get a single landing page setting by pageId
    get: publicProcedure
      .input(z.object({ pageId: z.string() }))
      .query(async ({ input }) => {
        return getLandingPageSetting(input.pageId);
      }),

    // Update a landing page setting (admin only)
    update: adminProcedure
      .input(z.object({
        pageId: z.string(),
        colorScheme: z.string().optional(),
        marketingAngle: z.string().optional(),
        ctaText: z.string().optional(),
        redirectUrl: z.string().optional(),
        eventEndDate: z.string().optional(),
        ctaButtonId: z.number().nullable().optional(),
        angleId: z.number().nullable().optional(),
        galleryImages: z.string().optional(),
        subSentence: z.string().optional(),
        generatedColorScheme: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertLandingPageSetting(input);
        return { success: true };
      }),

    // Validate a single page
    validatePage: adminProcedure
      .input(z.object({
        pageId: z.string(),
        pageType: z.enum(['event', 'angle', 'use-case', 'default']),
      }))
      .query(async ({ input }) => {
        const pageSettings = await getLandingPageSetting(input.pageId);
        if (!pageSettings) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' });
        }

        let angle = null;
        if (pageSettings.angleId) {
          angle = await getMarketingAngle(pageSettings.angleId);
        }

        // Check if config file has custom content (always true for now - config files have gallery and subheadline)
        const hasConfigGallery = true; // All event pages have gallery images in config
        const hasConfigSubSentence = true; // All event pages have hero.subheadline in config

        return validateEventPage(pageSettings, angle || null, input.pageType, hasConfigGallery, hasConfigSubSentence);
      }),

    // Validate all pages
    validateAll: adminProcedure
      .query(async () => {
        const allSettings = await getAllLandingPageSettings();
        const angles = await getAllMarketingAngles();
        const angleMap = new Map(angles.map(a => [a.id, a]));

        // Map page IDs to their types (simplified - in production, fetch from config)
        const pageTypes: Record<string, 'event' | 'angle' | 'use-case' | 'default'> = {
          'default': 'default',
          'valentine-gift': 'event',
          'mothers-day': 'event',
          'fathers-day': 'event',
          'black-friday': 'event',
          'down-alternative': 'angle',
          'restorative-alignment': 'angle',
          'hotel-quality': 'angle',
          'neck-pain-relief': 'angle',
          'side-sleeper': 'use-case',
        };

        const pages = allSettings.map(settings => ({
          settings,
          angle: settings.angleId ? angleMap.get(settings.angleId) || null : null,
          pageType: pageTypes[settings.pageId] || 'default' as const,
          hasConfigGallery: true, // All pages have gallery in config
          hasConfigSubSentence: true, // All pages have hero.subheadline in config
        }));

        const results = await validateAllPages(pages);
        return Object.fromEntries(results);
      }),

    // Update compliance status after validation
    updateComplianceStatus: adminProcedure
      .input(z.object({
        pageId: z.string(),
        complianceResult: z.object({
          isCompliant: z.boolean(),
          issueCount: z.number(),
          issues: z.array(z.any()),
          autoFixableCount: z.number(),
          checkedAt: z.date(),
        }),
      }))
      .mutation(async ({ input }) => {
        await upsertLandingPageSetting({
          pageId: input.pageId,
          complianceIssues: JSON.stringify(input.complianceResult.issues),
          autoFixAvailable: input.complianceResult.autoFixableCount > 0 ? 1 : 0,
          lastComplianceCheck: input.complianceResult.checkedAt,
        });
        return { success: true };
      }),

    // Auto-fix missing elements for a page
    autoFix: adminProcedure
      .input(z.object({
        pageId: z.string(),
        pageType: z.enum(['event', 'angle', 'use-case', 'default']),
        missingElements: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        const pageSettings = await getLandingPageSetting(input.pageId);
        if (!pageSettings) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' });
        }

        if (!pageSettings.angleId) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot auto-fix without an assigned angle' });
        }

        const angle = await getMarketingAngle(pageSettings.angleId);
        if (!angle) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Angle not found' });
        }

        const updates = await autoFixMissingElements(
          pageSettings as any,
          angle,
          input.pageType,
          input.missingElements
        );

        // Only update if there are changes
        if (Object.keys(updates).length > 0) {
          await upsertLandingPageSetting({
            pageId: input.pageId,
            ...updates,
          });
          return { success: true, updates, message: 'Auto-fix completed successfully' };
        }

        return { success: true, updates: {}, message: 'No updates needed - all elements already exist' };
      }),

    // Regenerate content when angle is changed
    regenerateContent: adminProcedure
      .input(z.object({
        pageId: z.string(),
        angleId: z.number(),
        pageType: z.enum(['event', 'angle', 'use-case', 'default']),
      }))
      .mutation(async ({ input }) => {
        const pageSettings = await getLandingPageSetting(input.pageId);
        if (!pageSettings) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' });
        }

        const angle = await getMarketingAngle(input.angleId);
        if (!angle) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Angle not found' });
        }

        const generatedContent = await regenerateContentForAngle(
          pageSettings as any,
          angle,
          input.pageType
        );

        await upsertLandingPageSetting({
          pageId: input.pageId,
          angleId: input.angleId,
          galleryImages: JSON.stringify(generatedContent.galleryImages),
          subSentence: generatedContent.subSentence,
          generatedColorScheme: generatedContent.colorScheme,
        });

        return { success: true, content: generatedContent };
      }),
  }),

  // CTA buttons API
  ctaButtons: router({
    // Get all CTA buttons (public - needed for frontend)
    getAll: publicProcedure.query(async () => {
      return getAllCtaButtons();
    }),

    // Get the default CTA button (public - needed for frontend)
    getDefault: publicProcedure.query(async () => {
      return getDefaultCtaButton();
    }),

    // Get a single CTA button by ID (admin only)
    get: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCtaButton(input.id);
      }),

    // Create a new CTA button (admin only)
    create: adminProcedure
      .input(z.object({
        text: z.string(),
        secondaryText: z.string().optional(),
        alternativeText: z.string().optional(),
        variant: z.string().optional(),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input }) =>{
        await createCtaButton(input);
        return { success: true };
      }),

    // Update a CTA button (admin only)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        text: z.string().optional(),
        secondaryText: z.string().optional(),
        alternativeText: z.string().optional(),
        variant: z.string().optional(),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateCtaButton(id, data);
        return { success: true };
      }),

    // Delete a CTA button (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCtaButton(input.id);
        return { success: true };
      }),

    // Set a CTA button as default (admin only)
    setDefault: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await setDefaultCtaButton(input.id);
        return { success: true };
      }),

    // Reorder CTA buttons (admin only)
    reorder: adminProcedure
      .input(z.object({
        buttons: z.array(z.object({
          id: z.number(),
          sortOrder: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        // Update sort order for each button
        for (const button of input.buttons) {
          await updateCtaButton(button.id, { sortOrder: button.sortOrder });
        }
        return { success: true };
      }),
  }),

  // Site settings API
  settings: router({
    // Get all settings (public - needed for frontend display)
    getAll: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getAllSiteSettings(input?.category);
      }),

    // Get a single setting by key (public)
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return getSiteSetting(input.key);
      }),

    // Update a setting (admin only)
    update: adminProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        label: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertSiteSetting(input);
        return { success: true };
      }),

    // Initialize default settings (admin only)
    initDefaults: adminProcedure
      .mutation(async () => {
        await initializeDefaultSettings();
        return { success: true };
      }),
  }),

  // Marketing angles API
  marketingAngles: router({
    // Get all marketing angles
    getAll: publicProcedure.query(async () => {
      return getAllMarketingAngles();
    }),

    // Get a single marketing angle by ID
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getMarketingAngle(input.id);
      }),

    // Create a new marketing angle (admin only)
    create: adminProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        productTitle: z.string().optional(),
        tags: z.string().optional(),
        description: z.string().optional(),
        colorScheme: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createMarketingAngle(input);
        return { success: true };
      }),

    // Update a marketing angle (admin only)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slug: z.string().optional(),
        name: z.string().optional(),
        productTitle: z.string().optional(),
        tags: z.string().optional(),
        description: z.string().optional(),
        colorScheme: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateMarketingAngle(id, data);
        return { success: true };
      }),

    // Delete a marketing angle (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMarketingAngle(input.id);
        return { success: true };
      }),

    // Initialize default angles (admin only)
    initDefaults: adminProcedure
      .mutation(async () => {
        await initializeDefaultMarketingAngles();
        return { success: true };
      }),
  }),

  // Color schemes API
  colorSchemes: router({
    // Get all color schemes
    getAll: publicProcedure.query(async () => {
      return getAllColorSchemes();
    }),

    // Get a single color scheme by slug
    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getColorSchemeBySlug(input.slug);
      }),

    // Create a new color scheme (admin only)
    create: adminProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        accentColor: z.string(),
        accentDarkColor: z.string(),
        backgroundColor: z.string(),
        secondaryLightColor: z.string(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        isDark: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        // Convert isDark boolean to number for database
        const dbInput = {
          ...input,
          isDark: input.isDark !== undefined ? (input.isDark ? 1 : 0) : undefined,
        };
        await createColorScheme(dbInput as any);
        return { success: true };
      }),

    // Update a color scheme (admin only)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          slug: z.string().optional(),
          name: z.string().optional(),
          primaryColor: z.string().optional(),
          secondaryColor: z.string().optional(),
          accentColor: z.string().optional(),
          accentDarkColor: z.string().optional(),
          backgroundColor: z.string().optional(),
          secondaryLightColor: z.string().optional(),
          description: z.string().optional(),
          sortOrder: z.number().optional(),
          isActive: z.number().optional(),
          isDark: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Convert isDark boolean to number for database
        const dbData = {
          ...input.data,
          isDark: input.data.isDark !== undefined ? (input.data.isDark ? 1 : 0) : undefined,
        };
        await updateColorScheme(input.id, dbData as any);
        return { success: true };
      }),

    // Delete a color scheme (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteColorScheme(input.id);
        return { success: true };
      }),

    // Initialize default color schemes (admin only)
    initDefaults: adminProcedure
      .mutation(async () => {
        await initDefaultColorSchemes();
        return { success: true };
      }),
  }),

});

export type AppRouter = typeof appRouter;
