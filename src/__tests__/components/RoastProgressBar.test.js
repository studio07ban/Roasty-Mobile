/** @jest-environment jsdom */
import React from "react";
import { render, act } from "@testing-library/react";
import { RoastProgressBar } from "../../components/RoastProgressBar";

var mockTiming;

jest.mock("react-native", () => {
  mockTiming = jest.fn(() => ({ start: (cb) => (cb ? cb() : undefined) }));
  const React = require("react");
  return {
    Animated: {
      View: ({ children }) => React.createElement("div", null, children),
      Value: class {
        constructor(v) {
          this.value = v;
        }
        interpolate() {
          return this.value;
        }
      },
      timing: mockTiming,
    },
    Easing: { out: (fn) => fn, ease: () => null },
    StyleSheet: { create: (s) => s },
    Text: ({ children }) => React.createElement("span", null, children),
    View: ({ children }) => React.createElement("div", null, children),
    ImageBackground: ({ children }) =>
      React.createElement("div", null, children),
  };
});
jest.mock("../../assets/background.jpg", () => "bg");

describe("RoastProgressBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.99);
    mockTiming?.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("exporte bien le composant", () => {
    expect(typeof RoastProgressBar).toBe("function");
  });

  it("commence à 0%", () => {
    const { getByText } = render(
      <RoastProgressBar isActive={false} label="Peu importe" />
    );
    expect(getByText("0%")).toBeTruthy();
  });

  it("utilise Animated.timing pour animer la barre", () => {
    render(<RoastProgressBar isActive={false} label="Peu importe" />);
    expect(mockTiming).toHaveBeenCalled();
  });

  it("va jusqu'à 100% et appelle onFinished", () => {
    const onFinished = jest.fn();

    const { getByText } = render(
      <RoastProgressBar isActive={true} onFinished={onFinished} />
    );

    act(() => {
      jest.advanceTimersByTime(8000);
    });

    expect(onFinished).toHaveBeenCalled();
    expect(getByText("100%")).toBeTruthy();
  });
});
