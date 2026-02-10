import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export default function App() {
  return (
    <AspectRatioPrimitive.Root ratio={16 / 9}>
      <img src="/example.jpg" alt="Example" />
    </AspectRatioPrimitive.Root>
  );
}
