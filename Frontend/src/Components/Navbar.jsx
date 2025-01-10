import { MessageSquare } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center">
        <MessageSquare className="p-1 size-10 text-yellow-600 self-center rounded-md" />
        <div className="font-semibold ml-2 self-center text-center text-opacity-65 text-2xl">Chatty</div>
        <div className="font-semibold ml-auto mr-5 self-center text-center text-opacity-65 text-2xl"><a href="/settings">Settings</a></div>
      </div>
    </>
  );
};

export default Navbar;
