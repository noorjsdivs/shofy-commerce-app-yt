import Container from "@/components/Container";
import Title from "@/components/Title";
import Button from "@/components/ui/Button";
import React from "react";

const CancelPage = () => {
  return (
    <Container className="py-10">
      <Title>Your payment has been cancelled</Title>
      <p className="text-base tracking-wide max-w-3xl mt-1">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam vel
        accusantium eaque odio, provident cupiditate ipsa ullam dolores fuga
        nostrum blanditiis nam! Eligendi, nulla fuga iste aliquid, accusamus
        odit suscipit voluptatem itaque perferendis fugit animi quas totam unde.
        Quidem ipsum ut officiis quod laboriosam optio adipisci aliquid ducimus
        odit distinctio similique molestiae aliquam voluptatem, maxime ad
        molestias tempora! Sunt iste ipsum at veritatis ab nisi ipsa ut possimus
        ea quis maxime quasi enim, sint placeat, impedit doloribus facere neque
        vel totam vitae voluptate reprehenderit voluptatem! Mollitia rerum illo
        cumque voluptatem qui voluptate, earum in distinctio assumenda quod
        debitis iste sed!
      </p>
      <div className="mt-5 flex items-center gap-x-5">
        <Button href="/" className=" rounded-md">
          Continue Shopping
        </Button>
        <Button href="/cart" className=" rounded-md">
          View Cart
        </Button>
      </div>
    </Container>
  );
};

export default CancelPage;
