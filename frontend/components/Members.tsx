type MemberProps = {
  clients: string[];
};

export default function Members({ clients }: MemberProps) {
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
