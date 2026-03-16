import asyncio
import os
import sys
sys.path.insert(0, '/app/backend')

from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

async def generate_honeybee_logo():
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not found in environment")
        return
    
    image_gen = OpenAIImageGeneration(api_key=api_key)
    
    # Generate the main app icon - a cute honeybee for kids
    prompt = """Create a cute, friendly cartoon honeybee mascot logo for a children's educational app called "Pattern Coach". 
    The bee should be:
    - Adorable and kid-friendly with big expressive eyes
    - Yellow and black striped body with small wings
    - Smiling warmly
    - Simple, clean design perfect for an app icon
    - Set against a solid emerald green background (#10B981)
    - Centered in frame, suitable for a square app icon
    - Flat design style, no gradients, bold colors
    - The bee should look intelligent and encouraging, like a helpful teacher
    """
    
    print("Generating honeybee logo... (this may take up to 60 seconds)")
    
    try:
        images = await image_gen.generate_images(
            prompt=prompt,
            model="gpt-image-1",
            number_of_images=1
        )
        
        if images and len(images) > 0:
            # Save as main icon (1024x1024 is standard for app icons)
            icon_path = "/app/frontend/assets/images/icon.png"
            with open(icon_path, "wb") as f:
                f.write(images[0])
            print(f"✓ Saved main icon to {icon_path}")
            
            # Use same image for adaptive icon
            adaptive_path = "/app/frontend/assets/images/adaptive-icon.png"
            with open(adaptive_path, "wb") as f:
                f.write(images[0])
            print(f"✓ Saved adaptive icon to {adaptive_path}")
            
            # Use same image for splash icon
            splash_path = "/app/frontend/assets/images/splash-icon.png"
            with open(splash_path, "wb") as f:
                f.write(images[0])
            print(f"✓ Saved splash icon to {splash_path}")
            
            # Use same image for favicon
            favicon_path = "/app/frontend/assets/images/favicon.png"
            with open(favicon_path, "wb") as f:
                f.write(images[0])
            print(f"✓ Saved favicon to {favicon_path}")
            
            print("\n✅ All honeybee logo images generated successfully!")
        else:
            print("ERROR: No image was generated")
            
    except Exception as e:
        print(f"ERROR generating images: {e}")

if __name__ == "__main__":
    asyncio.run(generate_honeybee_logo())
