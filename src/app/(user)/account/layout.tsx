import AccountLayout from "../../../components/admin/AccountLayout";

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
