type StepCardProps = {
  number: string;
  title: string;
  emoji: string;
};

export default function StepCard({ number, title, emoji }: StepCardProps) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md flex flex-col items-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="text-xl font-bold mt-4">
        {number}. {title}
      </h3>
    </div>
  );
}
