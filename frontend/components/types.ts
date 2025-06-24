type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: {
    label: string;
    href: string;
  }[];
};
