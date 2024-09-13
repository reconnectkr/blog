import NavigationItem from "./NavigationItem";

export default function SideNavigationBar() {
  return (
    <nav className="bg-white w-64 flex-shrink-0 border-r p-4">
      <ul>
        <NavigationItem href="Blog" />
        <NavigationItem href="About" />
      </ul>
    </nav>
  );
}
