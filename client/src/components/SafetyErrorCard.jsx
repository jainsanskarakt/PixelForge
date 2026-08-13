import React from "react";
import styled from "styled-components";
import { WarningAmber, AutoAwesome } from "@mui/icons-material";

const Container = styled.div`
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 165, 0, 0.35);
  background: linear-gradient(145deg, rgba(60, 30, 10, 0.55), rgba(40, 20, 5, 0.4));
  backdrop-filter: blur(10px);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  animation: fadeIn 0.35s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #ffb74d;
`;

const Reason = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  color: ${({ theme }) => theme.text_secondary};
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 165, 0, 0.4), transparent);
  margin: 2px 0;
`;

const SuggestionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  cursor: pointer;
  border: 1px solid rgba(138, 43, 226, 0.4);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #e0b3ff;
  background: rgba(138, 43, 226, 0.12);
  transition: all 0.25s ease;
  &:hover {
    background: rgba(138, 43, 226, 0.3);
    border-color: #8a2be2;
    color: #fff;
    transform: translateY(-1px);
  }
`;

const SafetyErrorCard = ({ error, onSelect }) => {
  const suggestions = error?.data?.suggestions || [];

  return (
    <Container>
      <Header>
        <WarningAmber style={{ color: "#ffb74d", fontSize: "20px" }} />
        <Title>{error?.data?.title || "This prompt couldn't be created"}</Title>
      </Header>
      <Reason>{error?.data?.reason}</Reason>
      {suggestions.length > 0 && (
        <>
          <Divider />
          <SuggestionLabel>
            <AutoAwesome style={{ fontSize: "14px", color: "#9d4edd" }} />
            You can ask for these instead
          </SuggestionLabel>
          <Chips>
            {suggestions.map((suggestion) => (
              <Chip key={suggestion} onClick={() => onSelect(suggestion)}>
                {suggestion}
              </Chip>
            ))}
          </Chips>
        </>
      )}
    </Container>
  );
};

export default SafetyErrorCard;
