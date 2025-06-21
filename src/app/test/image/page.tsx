import ImageTest from '@/components/ImageTest';

export default function ImageTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test</h1>
      <ImageTest />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check the browser's console (F12) for any error messages</li>
          <li>Verify the image exists at: <code className="bg-gray-200 px-2 py-1 rounded">/public/images/cover-sonu.jpg</code></li>
          <li>Try accessing the image directly: <code className="bg-gray-200 px-2 py-1 rounded">/images/cover-sonu.jpg</code></li>
          <li>Check the Network tab in DevTools to see the image request</li>
        </ol>
      </div>
    </div>
  );
}
