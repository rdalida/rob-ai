#!/usr/bin/env python3
"""
Script to automatically update sbms.html with LLM-generated content.
Extracts headlines from news digest files and uses OpenAI API to generate
timeline titles and tooltip summaries. Automatically detects new digest files
and adds them to the timeline.
"""

import os
import re
import json
import glob
from datetime import datetime
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
        
        prompt = f"""Based on these school health news articles, analyze them for School-Based Medicaid Services (SBMS) relevance and generate:

1. A concise timeline title (max 8 words) - Follow these rules:
   - IF there are updates/changes to Medicaid regulations, federal Medicaid guidance, school-based Medicaid policies, or anything directly affecting Medicaid in schools: Create a descriptive title about those changes
   - IF there are NO significant Medicaid-related updates: Use "Not much happened today" or "No significant news events"

2. A brief tooltip summary (1-2 sentences) explaining the key developments

Priority topics for timeline titles:
- Medicaid regulation changes
- Federal CMS guidance for schools
- School-based Medicaid billing/compliance updates
- State Medicaid policy changes affecting schools
- School health funding related to Medicaid

Articles:
{articles_text}

Please respond in this exact JSON format:
{{
    "timeline_title": "your title here",
    "tooltip_summary": "your summary here"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
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
    
    def find_digest_files(self):
        """Find all digest files in the news folder and return them sorted by date."""
        news_dir = self.base_dir / 'news'
        digest_pattern = news_dir / 'digest_*.html'
        
        digest_files = []
        for file_path in glob.glob(str(digest_pattern)):
            file_path = Path(file_path)
            
            # Verify the file actually exists
            if not file_path.exists():
                continue
                
            file_name = file_path.name
            # Extract date from filename (digest_YYYYMMDD.html)
            match = re.search(r'digest_(\d{8})\.html', file_name)
            if match:
                date_str = match.group(1)
                try:
                    # Parse date to ensure it's valid
                    date_obj = datetime.strptime(date_str, '%Y%m%d')
                    digest_files.append({
                        'file_path': file_path,
                        'date_str': date_str,
                        'date_obj': date_obj,
                        'formatted_date': date_obj.strftime('%b %d')  # e.g., "Jul 09"
                    })
                except ValueError:
                    print(f"⚠️  Invalid date format in {file_name}")
                    continue
        
        # Sort by date (newest first)
        digest_files.sort(key=lambda x: x['date_obj'], reverse=True)
        print(f"📁 Found digest files: {[f['file_path'].name for f in digest_files]}")
        return digest_files
    
    def get_existing_timeline_dates(self):
        """Get all dates that already exist in the timeline."""
        sbms_file = self.base_dir / 'sbms.html'
        
        try:
            with open(sbms_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all timeline dates in formatted form (e.g., "Jul 08")
            date_pattern = r'<span class="timeline-date">([^<]+)</span>'
            matches = re.findall(date_pattern, content)
            return set(matches)
            
        except Exception as e:
            print(f"❌ Error reading sbms.html: {e}")
            return set()
    
    def format_date_for_timeline(self, date_str):
        """Convert YYYYMMDD to timeline format (e.g., Jul 09)."""
        try:
            date_obj = datetime.strptime(date_str, '%Y%m%d')
            return date_obj.strftime('%b %d')
        except ValueError:
            return date_str
    
    def update_existing_timeline_entry(self, digest_file, timeline_title, tooltip_summary, tags):
        """Update an existing timeline entry in sbms.html."""
        sbms_file = self.base_dir / 'sbms.html'
        
        try:
            with open(sbms_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Create new timeline entry HTML components
            tags_html = ''.join([f'<span class="tag">{tag}</span>' for tag in tags])
            formatted_date = digest_file['formatted_date']
            digest_filename = digest_file['file_path'].name
            
            # Pattern to find the specific timeline item by date
            # This matches the entire timeline item including the tooltip
            pattern = rf'(<div class="timeline-item">\s*<span class="timeline-date">{re.escape(formatted_date)}</span>\s*<span class="timeline-title">)[^<]*(<a[^>]*>)?[^<]*(?:</a>)?(</span>\s*<div class="timeline-tooltip">[\s\S]*?</div>\s*</div>)'
            
            replacement = f'''\\g<1><a href="news/{digest_filename}" style="color:inherit;text-decoration:underline;">{timeline_title}</a></span>
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
                print(f"✅ Updated existing timeline entry for {formatted_date}")
                return True
            else:
                print(f"⚠️  Could not update timeline entry for {formatted_date}")
                return False
                
        except Exception as e:
            print(f"❌ Error updating timeline entry: {e}")
            return False

    def add_new_timeline_entry(self, digest_file, timeline_title, tooltip_summary, tags):
        """Add a new timeline entry to sbms.html."""
        sbms_file = self.base_dir / 'sbms.html'
        
        try:
            with open(sbms_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Create new timeline entry HTML
            tags_html = ''.join([f'<span class="tag">{tag}</span>' for tag in tags])
            formatted_date = digest_file['formatted_date']
            digest_filename = digest_file['file_path'].name
            
            new_entry = f'''      <div class="timeline-item">
        <span class="timeline-date">{formatted_date}</span>
        <span class="timeline-title"><a href="news/{digest_filename}" style="color:inherit;text-decoration:underline;">{timeline_title}</a></span>
        <div class="timeline-tooltip">
          <div class="tags">
            {tags_html}
          </div>
          <div class="tooltip-desc">
            {tooltip_summary}
          </div>
        </div>
      </div>'''
            
            # Find the timeline section and add the new entry at the top (after opening tag)
            timeline_pattern = r'(<div class="timeline" id="timeline">\s*)'
            
            def add_entry(match):
                return f'{match.group(1)}\n{new_entry}'
            
            new_content = re.sub(timeline_pattern, add_entry, content)
            
            if new_content != content:
                with open(sbms_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added new timeline entry for {formatted_date}")
                return True
            else:
                print("⚠️  Could not find timeline section to add entry")
                return False
                
        except Exception as e:
            print(f"❌ Error adding timeline entry: {e}")
            return False
    
    def run(self):
        """Main function to run the timeline update process."""
        print("🚀 Starting timeline update process...")
        
        # Find all digest files
        digest_files = self.find_digest_files()
        
        if not digest_files:
            print("❌ No digest files found")
            return False
        
        # Get existing timeline dates (in formatted form like "Jul 08")
        existing_dates = self.get_existing_timeline_dates()
        print(f"📅 Existing timeline dates: {sorted(existing_dates)}")
        
        for digest_file in digest_files:
            formatted_date = digest_file['formatted_date']
            
            print(f"📖 Processing {digest_file['file_path'].name} for {formatted_date}")
            articles = self.extract_headlines_from_digest(digest_file['file_path'])
            
            if not articles:
                print("⚠️  No articles found in digest file")
                continue
            
            print(f"📄 Found {len(articles)} articles")
            
            print("🤖 Generating timeline content with OpenAI...")
            timeline_title, tooltip_summary = self.generate_timeline_content(articles)
            
            print("🏷️  Extracting relevant tags...")
            tags = self.extract_tags_from_articles(articles)
            
            print(f"📝 Generated content:")
            print(f"   Title: {timeline_title}")
            print(f"   Summary: {tooltip_summary}")
            print(f"   Tags: {', '.join(tags)}")
            
            # Check if this date already exists in the timeline
            if formatted_date in existing_dates:
                print(f"� Updating existing timeline entry for {formatted_date}")
                success = self.update_existing_timeline_entry(digest_file, timeline_title, tooltip_summary, tags)
            else:
                print(f"➕ Adding new timeline entry for {formatted_date}")
                success = self.add_new_timeline_entry(digest_file, timeline_title, tooltip_summary, tags)
            
            if success:
                print("✅ Timeline update completed successfully!")
            else:
                print("❌ Timeline update failed")
        
        return True

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
