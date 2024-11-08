import styled from "styled-components";

export const Accordion = styled.div<{ isOpen: boolean }>`
  display: block;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.primary};

  .accordion-arrow {
    width: 15px;
    height: 15px;
    transform-origin: center;
    transform: ${({ isOpen }) => isOpen && "rotate(180deg)"};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  column-gap: 6px;
`;

export const ContentWrapper = styled.div`
  padding-top: 20px;
`;
