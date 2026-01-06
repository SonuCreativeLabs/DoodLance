import fs from 'fs';
import path from 'path';

// Clean up chat-list.tsx
const chatListPath = path.join(process.cwd(), 'src/components/freelancer/inbox/chat-list.tsx');
if (fs.existsSync(chatListPath)) {
  let content = fs.readFileSync(chatListPath, 'utf8');
  
  // Remove test chat data
  content = content.replace(
    /(const\s+chats\s*=\s*propChats\.length\s*>\s*0\s*\?\s*propChats\s*:)\s*\[[\s\S]*?\]/,
    '$1 []; // Test data removed'
  );
  
  fs.writeFileSync(chatListPath, content, 'utf8');
  console.log('✅ Cleaned up test data in chat-list.tsx');
}

// Clean up chat-view.tsx
const chatViewPath = path.join(process.cwd(), 'src/components/freelancer/inbox/chat-view.tsx');
if (fs.existsSync(chatViewPath)) {
  let content = fs.readFileSync(chatViewPath, 'utf8');
  
  // Remove mock messages comment
  content = content.replace(
    /(\/\/\s*mockMessages removed; messages are now passed as a prop or fetched from API\s*\n\s*\n)/,
    ''
  );
  
  fs.writeFileSync(chatViewPath, content, 'utf8');
  console.log('✅ Cleaned up test data in chat-view.tsx');
}

console.log('\n✨ Chat components cleanup complete!');
