import { useConnectionStore } from "../stores/connection-store";

export default function Rooms() {
  const rooms = useConnectionStore((state) => state.rooms);
  return (
    <>
      <h3 className="text-2xl ">Rooms ({rooms.length})</h3>
      <ul>
        {rooms.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </>
  );
}
