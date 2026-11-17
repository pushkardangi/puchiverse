type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return <p className="card-surface text-sm leading-6 text-[#766d69]">{message}</p>;
}
