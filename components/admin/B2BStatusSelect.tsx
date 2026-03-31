"use client";

export default function B2BStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  return (
    <select
      defaultValue={status}
      onChange={async (e) => {
        try {
          await fetch("/api/admin/b2b/update-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              status: e.target.value,
            }),
          });

          location.reload();
        } catch (err) {
          console.error(err);
          alert("Erreur mise à jour");
        }
      }}
      style={select}
    >
      <option value="NEW">NEW</option>
      <option value="CONTACTED">CONTACTED</option>
      <option value="CLOSED">CLOSED</option>
    </select>
  );
}

const select = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};