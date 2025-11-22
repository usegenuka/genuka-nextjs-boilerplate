/**
 * Unauthorized Page
 * Shown when authentication fails or is missing
 */

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-8">
          You need to be authenticated to access this page.
          Please access this application through your Genuka dashboard.
        </p>

        <a
          href="https://genuka.com"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Genuka
        </a>
      </div>
    </div>
  );
}
