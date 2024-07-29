import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background-color: #f0e0d0;

  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;

  @media (max-width: 768px) {
    left: 20px;
    padding: 20px;
  }

  @media (max-width: 480px) {
    left: 10px;
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Button = styled.button`
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
  }
`;

const FashionTrends = () => {
  return (
    <Container>
      <Image src="https://assets.lummi.ai/assets/QmQpHWspp14Q4nbnJ7PFyWuqaYAG6X5hdES1Jy3tNRdHBV?auto=format&w=1500" alt="Fashion models" />
      <Overlay>
        <Title className='Asul'>Discover The Latest Trends <br /> In Fashion</Title>
        <Subtitle>Stay ahead of the fashion curve with <br /> our latest trends collection.</Subtitle>
        <Button>Shop All Products</Button>
      </Overlay>
    </Container>
  );
};

export default FashionTrends;
