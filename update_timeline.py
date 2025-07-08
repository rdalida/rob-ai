#!/usr/bin/env python3
"""
Script to automatically update sbms.html with LLM-generated content.
Extracts headlines from news digest files and uses OpenAI API to generate
timeline titles and tooltip summaries.
"""

import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TimelineUpdater:
    def __init__(self):
        """Initialize the timeline updater with OpenAI client."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=api_key)
        self.base_dir = Path(__file__).parent
        
    def extract_headlines_from_digest(self, digest_file_path):
        """Extract article headlines and summaries from a digest HTML file."""
        try:
            with open(digest_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract article titles and excerpts
            articles = []
            article_items = soup.find_all('div', class_='article-item')
            
            for item in article_items:
                title_elem = item.find('h4')
                excerpt_elem = item.find('p', class_='excerpt')
                
                if title_elem and excerpt_elem:
                    title = title_elem.get_text().strip()
                    excerpt = excerpt_elem.get_text().strip()
                    articles.append({
                        'title': title,
                        'excerpt': excerpt
                    })
            
            return articles
            
        except Exception as e:
            print(f"Error extracting headlines from {digest_file_path}: {e}")
            return []
    
    def generate_timeline_content(self, articles):
        """Use OpenAI API to generate timeline title and tooltip summary."""
        if not articles:
            return "not much happened today", "No significant news events."
        
        # Prepare content for OpenAI
        articles_text = "\n".join([
            f"- {article['title']}: {article['excerpt'][:100]}..."
            for article in articles
        ])
        
        prompt = f"""Based on these school health Medicaid news articles, generate:

1. A concise timeline title (max 8 words) suitable for a news timeline
2. A brief tooltip summary (1-2 sentences) explaining the key developments

Articles:
{articles_text}

Please respond in this exact JSON format:
{{
    "timeline_title": "your title here",
    "tooltip_summary": "your summary here"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a news summarization expert specializing in healthcare policy and Medicaid programs."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            content = response.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                result = json.loads(content)
                return result.get('timeline_title', 'not much happened today'), result.get('tooltip_summary', 'No summary available.')
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                print("Failed to parse JSON response, using fallback")
                return "School health Medicaid updates", "Multiple updates in school health Medicaid policy and guidance."
                
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return "not much happened today", "Unable to generate summary."
    
    def extract_tags_from_articles(self, articles):
        """Extract relevant tags from articles for the tooltip."""
        tags = set()
        
        for article in articles:
            text = (article['title'] + ' ' + article['excerpt']).lower()
            
            # Common SBMS-related tags
            if 'cms' in text or 'federal' in text or 'guidance' in text:
                tags.add('federal-guidance')
            if 'compliance' in text or 'audit' in text or 'billing' in text:
                tags.add('compliance')
            if 'funding' in text or 'grant' in text or 'money' in text:
                tags.add('funding')
            if 'state' in text:
                tags.add('state-news')
            if 'iep' in text or 'special education' in text:
                tags.add('special-education')
            if 'medicaid' in text:
                tags.add('medicaid')
        
        # Ensure we have at least some tags
        if not tags:
            tags = {'medicaid', 'update'}
        
        return list(tags)[:4]  # Limit to 4 tags
    
    def update_sbms_html(self, date_str, timeline_title, tooltip_summary, tags):
        """Update the sbms.html file with new timeline content."""
        sbms_file = self.base_dir / 'sbms.html'
        
        try:
            with open(sbms_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Create new tooltip content
            tags_html = ''.join([f'<span class="tag">{tag}</span>' for tag in tags])
            
            # Pattern to find and replace the Jul 07 timeline item
            pattern = r'(<div class="timeline-item">\s*<span class="timeline-date">Jul 07</span>\s*<span class="timeline-title">)[^<]*(.*?</div>\s*</div>)'
            
            replacement = f'''\\g<1><a href="news/digest_20250708.html" style="color:inherit;text-decoration:underline;">{timeline_title}</a></span>
        <div class="timeline-tooltip">
          <div class="tags">
            {tags_html}
          </div>
          <div class="tooltip-desc">
            {tooltip_summary}
          </div>
        </div>
      </div>'''
            
            # Perform the replacement
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
            if new_content != content:
                with open(sbms_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("✅ Successfully updated sbms.html")
                return True
            else:
                print("⚠️  No changes made to sbms.html")
                return False
                
        except Exception as e:
            print(f"❌ Error updating sbms.html: {e}")
            return False
    
    def run(self):
        """Main function to run the timeline update process."""
        print("🚀 Starting timeline update process...")
        
        # Path to the latest digest file
        digest_file = self.base_dir / 'news' / 'digest_20250708.html'
        
        if not digest_file.exists():
            print(f"❌ Digest file not found: {digest_file}")
            return False
        
        print(f"📖 Extracting headlines from {digest_file}")
        articles = self.extract_headlines_from_digest(digest_file)
        
        if not articles:
            print("⚠️  No articles found in digest file")
            return False
        
        print(f"📄 Found {len(articles)} articles")
        
        print("🤖 Generating timeline content with OpenAI...")
        timeline_title, tooltip_summary = self.generate_timeline_content(articles)
        
        print("🏷️  Extracting relevant tags...")
        tags = self.extract_tags_from_articles(articles)
        
        print(f"📝 Generated content:")
        print(f"   Title: {timeline_title}")
        print(f"   Summary: {tooltip_summary}")
        print(f"   Tags: {', '.join(tags)}")
        
        print("💾 Updating sbms.html...")
        success = self.update_sbms_html('Jul 07', timeline_title, tooltip_summary, tags)
        
        if success:
            print("✅ Timeline update completed successfully!")
        else:
            print("❌ Timeline update failed")
        
        return success

def main():
    """Main entry point."""
    try:
        updater = TimelineUpdater()
        updater.run()
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
