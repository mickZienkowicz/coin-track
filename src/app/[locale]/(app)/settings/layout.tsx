export default async function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className='w-full pb-8'>{children}</main>;
}
