import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <main className="flex h-screen justify-center">
      <div className="w-full overflow-y-scroll overflow-hidden border-x-2 border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
}
