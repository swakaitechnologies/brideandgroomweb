import os
import re

def migrate_env_vars(directory):
    # Pattern to match process.env.NEXT_PUBLIC_VAR or process.env?.NEXT_PUBLIC_VAR
    pattern = re.compile(r'process\.env(?:\?)?\.NEXT_PUBLIC_([A-Z0-9_]+)')
    
    # Also handle things like process.env.NODE_ENV if used (unlikely in frontend components)
    generic_pattern = re.compile(r'process\.env(?:\?)?\.([A-Z0-9_]+)')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace NEXT_PUBLIC with VITE
                new_content = pattern.sub(r'import.meta.env.VITE_\1', content)
                
                # Check for other process.env usage that isn't NEXT_PUBLIC
                remaining_process = generic_pattern.findall(new_content)
                if remaining_process:
                    for var in remaining_process:
                        if var not in ['NODE_ENV', 'BROWSER']: # Standard ones that might need special handling
                             new_content = new_content.replace(f'process.env.{var}', f'import.meta.env.VITE_{var}')
                             new_content = new_content.replace(f'process.env?.{var}', f'import.meta.env.VITE_{var}')
                
                if content != new_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Migrated env vars: {path}")

if __name__ == "__main__":
    migrate_env_vars("src")
