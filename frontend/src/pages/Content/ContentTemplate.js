
const ContentTemplate = ({ title, text, createdAt }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="text-sm text-gray-600">
            Published on: {new Date(createdAt).toLocaleDateString()}
          </div>
        </header>

        <div className="prose prose-lg text-gray-800">{text}</div>
      </article>
    </div>
  );
};

export default ContentTemplate;
