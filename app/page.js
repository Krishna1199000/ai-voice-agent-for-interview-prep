import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import { Divide } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Hello world</h1>
      <Button variant={'destructive'}>krishna</Button>
      <UserButton/>
    </div>
  );
}
