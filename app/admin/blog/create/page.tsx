import BlogForm from "@/components/admin/BlogForm";

export default function CreateBlogPage() {
  return (
    <div style={container}>
      <h1 style={title}>➕ Nouvel article</h1>
      <BlogForm />
    </div>
  );
}

const container = { padding: 30 };
const title = { fontSize: 28, marginBottom: 20 };