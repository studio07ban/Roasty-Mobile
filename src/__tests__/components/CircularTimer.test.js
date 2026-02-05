import { render } from "@testing-library/react-native";
import CircularTimer from "../../components/CircularTimer";

jest.mock("react-native-countdown-circle-timer", () => {
  return {
    CountdownCircleTimer: ({ children, duration }) => {
      return children({ remainingTime: duration });
    },
  };
});

describe("CircularTimer Component", () => {
  it('doit formater 1500 secondes en "25:00"', () => {
    const { getByText } = render(
      <CircularTimer duration={1500} isPlaying={false} onComplete={() => {}} />
    );
    expect(getByText("25:00")).toBeTruthy();
  });

  it('doit formater 65 secondes en "01:05" (padding des minutes et secondes)', () => {
    const { getByText } = render(
      <CircularTimer duration={65} isPlaying={false} onComplete={() => {}} />
    );
    expect(getByText("01:05")).toBeTruthy();
  });

  it('doit formater 9 secondes en "00:09"', () => {
    const { getByText } = render(
      <CircularTimer duration={9} isPlaying={false} onComplete={() => {}} />
    );
    expect(getByText("00:09")).toBeTruthy();
  });
});
