
import re

def count_tags(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove comments
    content = re.sub(r'\{/\*.*?\*/\}', '', content, flags=re.DOTALL)
    content = re.sub(r'//.*', '', content)
    
    # Find all tags
    tags = re.findall(r'<(/?\w+)', content)
    
    stack = []
    for tag in tags:
        if tag.startswith('/'):
            tag_name = tag[1:]
            if not stack:
                print(f"Error: Closing tag </{tag_name}> found with no opening tag.")
                continue
            last_tag = stack.pop()
            if last_tag != tag_name:
                print(f"Error: Closing tag </{tag_name}> does not match opening tag <{last_tag}>.")
                # Put it back to try to find the match later
                # stack.append(last_tag)
        else:
            # Check for self-closing tags (simplified)
            # This is hard with regex, so we'll just skip some common self-closing ones in our list
            if tag in ['img', 'br', 'hr', 'input', 'Link', 'ArrowRight', 'Bird', 'ShieldCheck', 'BarChart3', 'Zap', 'CheckCircle2', 'Activity', 'Target', 'Thermometer', 'Users', 'Truck', 'Landmark', 'Wallet', 'Layers', 'History', 'Clock', 'Gauge', 'FlaskConical', 'Droplets', 'AlertCircle', 'ChevronRight', 'TrendingUp', 'ShieldAlert', 'Wind', 'Beaker', 'BarChart', 'LineChart', 'Calculator', 'span', 'h1', 'h2', 'h3', 'h4', 'p', 'a']:
                # These are often used as components that might be self-closing or not.
                # In this file, most are components from lucide.
                pass
            
            stack.append(tag)
            
    if stack:
        print(f"Error: Unclosed tags: {stack}")
    else:
        print("All tags balanced (roughly).")

count_tags('/Users/jotapelessa/DEV/OUTROS PROJETOS/AV365/src/app/page.tsx')
