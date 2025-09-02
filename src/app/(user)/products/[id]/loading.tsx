import Container from "@/components/Container";
import SingleProductSkeleton from "@/components/SingleProductSkeleton";

const loading = () => {
  return (
    <Container>
      <SingleProductSkeleton />
    </Container>
  );
};

export default loading;
