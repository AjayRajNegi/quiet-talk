import { useConnectionStore } from "../stores/connection-store";

export default function Rooms() {
  const rooms = useConnectionStore((state) => state.rooms);
  const join = useConnectionStore((state) => state.join);

  function createRandomString(): string {
    console.log(`Room-${Math.floor(Math.random() * 1000000)}`);
    return `Room-${Math.floor(Math.random() * 1000000)}`;
  }

  return (
    <>
      <h3 className="text-2xl ">Rooms ({rooms.length})</h3>
      <ul>
        {rooms.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="flex gap-2 md:flex-col pt-2 text-center">
        <div
          className="border rounded p-2"
          onClick={() => join(createRandomString())}
        >
          Create a Room
        </div>
        <input className="border rounded p-2" placeholder="Join a Room" />
      </div>
    </>
  );
}
