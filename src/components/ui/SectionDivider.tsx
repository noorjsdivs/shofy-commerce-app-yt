import Container from "../Container";

interface Props {
  className?: string;
}

const SectionDivider = ({ className = "" }: Props) => {
  return (
    <Container className={`py-8 ${className}`}>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </Container>
  );
};

export default SectionDivider;
