import BlogForm from "@/components/admin/BlogForm";

export default function CreateBlogPage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>➕ Nouvel article</h1>
      <BlogForm />
    </div>
  );
}