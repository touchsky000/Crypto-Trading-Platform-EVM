"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { createChart, ColorType } from "lightweight-charts";
import { TbCapture } from "react-icons/tb";
import { getMarketTicks } from "@/services/markets";
import { TPairInfo, TTick } from "@/lib/types";
import ButtonsDropDown from "./buttonsPopover";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { useUtilContext } from "@/hooks";

interface PriceDiagramProps {
  selectedPair: TPairInfo;
}


interface MarketTick {
  t: number;
  o: string;
  h: string;
  l: string;
  c: string;
}

export const GetMaxandMinPrice = (priceList: any) => {
  const maxValue = Math.max(...priceList.map((item: any) => item.close))
  const minValue = Math.min(...priceList.map((item: any) => item.close))
  return ({
    price24High: maxValue,
    price24Low: minValue
  })
}


export default function CandleStickChart({ selectedPair }: PriceDiagramProps) {
  const { setEthPrice, setHeaderPrice } = useUtilContext()

  const chain: string = "b_square_testnet"
  const [chartInterval, setChartInterval] = useState<string>("1m")
  const [countBack, setCountBack] = useState<Number>(100)

  const [tickData, setTickData] = useState<TTick[]>([
    {
      time: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    },
  ]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    let setted = false;

    const fetchData = async () => {
      if (!selectedPair.market) {
        console.error("Selected pair market is not defined.");
        return;
      }
      const response = await getMarketTicks(selectedPair.market, chain, chartInterval, countBack);

      const data = response ? response.data : tickData;
      const formattedTicks = data.map((tick: MarketTick) => ({
        time: tick.t / 1000,
        open: Number(tick.o),
        high: Number(tick.h),
        low: Number(tick.l),
        close: Number(tick.c),
      }));
      const result = GetMaxandMinPrice(formattedTicks)

      setHeaderPrice(result)
      setEthPrice(formattedTicks[formattedTicks.length - 1])
      setTickData(formattedTicks);

      if (candlestickSeriesRef.current === null) {
        if (chartContainerRef.current) {
          const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
            layout: {
              textColor: "#FEFEFE",
              background: { type: ColorType.Solid, color: "transparent" },
            },
            grid: {
              vertLines: {
                color: "rgba(197, 203, 206, 0.5)",
              },
              horzLines: {
                color: "rgba(197, 203, 206, 0.5)",
              },
            },
            rightPriceScale: {
              borderColor: "rgba(197, 203, 206, 0.8)",
            },
            timeScale: {
              borderColor: "rgba(197, 203, 206, 0.8)",
            },
          });
          candlestickSeriesRef.current = chart.addCandlestickSeries({
            upColor: "#13DF87",
            downColor: "#EA4161",
            borderVisible: false,
          });
          if (tickData.length > 1) {
            candlestickSeriesRef.current.setData(tickData);
          }
          chart.timeScale().fitContent();
          const handleResize = () => {
            if (chartContainerRef.current) {
              chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
              });
            }
          };

          window.addEventListener("resize", handleResize);
          return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
          };
        }
      } else {
        if (tickData.length > 1) {
          if (!setted) {
            candlestickSeriesRef.current.setData(tickData);
            setted = true;
          }
          else {
            candlestickSeriesRef.current.update(tickData[tickData.length - 1]);
          }
        }
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPair.market, tickData]);

  const setIntervalValue = (e: any) => {
    setChartInterval(e.target.value)
  }

  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card backdrop-blur-lg/2">
      <div className="my-5 flex flex-row gap-x-10 px-5 text-lg font-bold">
        <button>Price</button>
        <button>Depth</button>
      </div>
      <hr className="border border-border  " />
      <div className=" flex justify-between py-2 px-5">
        <div className="flex flex-wrap ">
          <div className="flex gap-3 flex-wrap   items-center">
            {" "}
            <button className="bg-button-tab hover:bg-primary px-4 rounded-lg" value="1m"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              1m
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="5m"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              5m
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="15m"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              15m
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="20m"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              20m
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="1h"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              1H
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="4h"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              4H
            </button>
            <button className="bg-button-tab text-sm hover:bg-primary px-4 rounded-lg" value="1d"
              onClick={(e) => {
                setIntervalValue(e)
              }}
            >
              1D
            </button>
            <ButtonsDropDown />
            <div className="flex text-md text-text-secondary">
              {" "}
              <Image
                alt="fx"
                src={"/assets/indicator.png"}
                width={20}
                height={20}
              />{" "}
              Indicators
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <IoSettingsSharp className="text-text-secondary" />
          <TbCapture className="text-text-secondary" />
          <FaCamera className="text-text-secondary" />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-y-5 px-6">
        <div className="flex flex-row gap-x-10">
          <p>{selectedPair.market}</p>
          <div>{`O: ${tickData.length > 0 ? tickData[tickData.length - 1].open : ""
            }, H: ${tickData.length > 0 ? tickData[tickData.length - 1].high : ""
            }, L: ${tickData.length > 0 ? tickData[tickData.length - 1].low : ""
            }, C: ${tickData.length > 0 ? tickData[tickData.length - 1].close : ""
            }`}</div>
        </div>
        <div
          ref={chartContainerRef}
          style={{ width: "100%", height: "300px" }}
        />
      </div>
    </div>
  );
}
