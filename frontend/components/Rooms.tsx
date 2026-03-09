type RoomsProps = {
  rooms: string[];
};
export default function Rooms({ rooms }: RoomsProps) {
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
