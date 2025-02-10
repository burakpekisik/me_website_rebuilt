import {
  CheckCircleIcon,
  CreditCardIcon,
  EnvelopeOpenIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

const StepperContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;
  position: relative;
`;

const StepsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 6px;
  width: 97%;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 0;
`;

const ActiveProgress = styled.div`
  position: absolute;
  top: 20px;
  left: 6px;
  height: 2px;
  background: linear-gradient(
    90deg,
    #ff8cba,
    #8b5cf6
  ); // Gradient from purple to pink
  transition: width 0.5s ease;
  width: ${(props) => props.progress - 2}%;
  z-index: 1;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  position: relative;
  z-index: 2;
  opacity: ${(props) => (props.future ? "0.5" : "1")};
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => {
    if (props.current) return "#8B5CF6"; // Purple for current step
    if (props.completed) return "#FF8CBA"; // Pink for completed steps
    return "#E5E7EB"; // Gray for inactive steps
  }};
  color: ${(props) =>
    props.completed || props.current ? "#FFFFFF" : "#9CA3AF"};
  transition: all 0.3s ease;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Added subtle shadow

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => {
    if (props.current) return "#8B5CF6"; // Purple for current step
    if (props.completed) return "#FF8CBA"; // Pink for completed steps
    return "#6B7280"; // Gray for future steps
  }};
  text-align: center;
  transition: all 0.3s ease;
  max-width: 120px;
`;

export function StepperWithContent({ activeStep = 0, links }) {
  const steps = [
    { icon: EnvelopeOpenIcon, label: "Mektup", link: links[0] },
    {
      icon: PaperAirplaneIcon,
      label: "Gönderici/Alıcı Bilgisi",
      link: links[1],
    },
    { icon: CheckCircleIcon, label: "Son Kontrol", link: links[2] },
    { icon: CreditCardIcon, label: "Ödeme", link: links[3] },
  ];

  const calculateProgress = () => {
    const totalSteps = steps.length - 1;
    return (activeStep / totalSteps) * 100;
  };

  const handleStepClick = (index, link) => {
    // Only allow navigation to previous steps
    if (index < activeStep && link) {
      window.location.href = link;
    }
  };

  return (
    <StepperContainer>
      <StepsWrapper>
        <ProgressLine />
        <ActiveProgress progress={calculateProgress()} />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;
          const isFuture = index > activeStep;

          return (
            <StepItem
              key={index}
              clickable={index < activeStep}
              future={isFuture}
              onClick={() => handleStepClick(index, step.link)}
            >
              <IconWrapper completed={isCompleted} current={isCurrent}>
                <Icon />
              </IconWrapper>
              <StepLabel completed={isCompleted} current={isCurrent}>
                {step.label}
              </StepLabel>
            </StepItem>
          );
        })}
      </StepsWrapper>
    </StepperContainer>
  );
}
