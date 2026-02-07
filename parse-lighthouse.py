import json

with open('lighthouse-report.report.json', 'r') as f:
    data = json.load(f)

# Get overall score
perf_score = data['categories']['performance']['score'] * 100

# Get key metrics
metrics = data['audits']
fcp = metrics['first-contentful-paint']['displayValue']
lcp = metrics['largest-contentful-paint']['displayValue']
tbt = metrics['total-blocking-time']['displayValue']
cls = metrics['cumulative-layout-shift']['displayValue']
si = metrics['speed-index']['displayValue']

# Get resource summary
resources = metrics['resource-summary']['details']['items']
total_size = 0
image_size = 0
for r in resources:
    total_size += r.get('transferSize', 0)
    if r['resourceType'] == 'image':
        image_size = r.get('transferSize', 0)

# Get opportunities
print('=== LIGHTHOUSE MOBILE PERFORMANCE AUDIT ===')
print('')
print(f'Overall Performance Score: {perf_score:.0f}/100')
print('')
print('=== Core Web Vitals ===')
print(f'First Contentful Paint (FCP): {fcp}')
print(f'Largest Contentful Paint (LCP): {lcp}')
print(f'Total Blocking Time (TBT): {tbt}')
print(f'Cumulative Layout Shift (CLS): {cls}')
print(f'Speed Index: {si}')
print('')
print('=== Resource Summary ===')
print(f'Total Transfer Size: {total_size / 1024 / 1024:.2f} MB')
print(f'Image Transfer Size: {image_size / 1024 / 1024:.2f} MB')
print('')

# Check for image-related opportunities
print('=== Image Optimization Opportunities ===')
if 'modern-image-formats' in metrics:
    audit = metrics['modern-image-formats']
    if audit.get('score', 1) < 1:
        print(f"Use modern image formats: Could save {audit.get('displayValue', 'N/A')}")
        
if 'uses-optimized-images' in metrics:
    audit = metrics['uses-optimized-images']
    if audit.get('score', 1) < 1:
        print(f"Optimize images: Could save {audit.get('displayValue', 'N/A')}")

if 'uses-responsive-images' in metrics:
    audit = metrics['uses-responsive-images']
    if audit.get('score', 1) < 1:
        print(f"Properly size images: Could save {audit.get('displayValue', 'N/A')}")

if 'offscreen-images' in metrics:
    audit = metrics['offscreen-images']
    if audit.get('score', 1) < 1:
        print(f"Defer offscreen images: Could save {audit.get('displayValue', 'N/A')}")
