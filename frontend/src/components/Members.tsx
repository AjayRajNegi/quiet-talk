import { useConnectionStore } from "../stores/connection-store";

export default function Members() {
  const clients = useConnectionStore((state) => state.clients);
  return (
    <>
      <h3 className="text-2xl ">Members ({clients.length})</h3>
      <ul>
        {clients.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </>
  );
}
