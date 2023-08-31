module.exports = async (draft, { sql }) => {
  const query = sql("mysql");
  const mapping_data = await query.select("mapping_table4").run();
  const mappingList = mapping_data.body.list;

  // 공통함수
  const getKey = (row, col) => [row, col].join("_");

  const mappingObject = mappingList.map((cur) => {
    return cur.reduce((acc, each) => {
      const newEach = { ...each };
      delete newEach.row_idx;
      delete newEach.col_idx;

      acc[getKey(each.row_idx, each.col_idx)] = JSON.parse(newEach.key_json);

      return acc;
    }, {});
  });

  // OCR데이터를 지금 여기에 불러와야 한다
  const OCRdata = [
    {
      version: "V2",
      requestId: "922e1dde-fb88-4dd5-9de9-75fb22d92ee0",
      timestamp: 1680481717905,
      images: [
        {
          uid: "37bc94525c6342859107031672d923db",
          name: "모바일 개발 일정 및 시안3.pdf-1/1",
          inferResult: "SUCCESS",
          message: "SUCCESS",
          validationResult: {
            result: "NO_REQUESTED",
          },
          convertedImageInfo: {
            width: 595,
            height: 841,
            pageIndex: 0,
            longImage: false,
          },
          tables: [
            {
              cells: [
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 25,
                            y: 98,
                          },
                          {
                            x: 49,
                            y: 98,
                          },
                          {
                            x: 49,
                            y: 112,
                          },
                          {
                            x: 25,
                            y: 112,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 25,
                                y: 98,
                              },
                              {
                                x: 49,
                                y: 98,
                              },
                              {
                                x: 49,
                                y: 112,
                              },
                              {
                                x: 25,
                                y: 112,
                              },
                            ],
                          },
                          inferText: "공정",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 78,
                      },
                      {
                        x: 50,
                        y: 78,
                      },
                      {
                        x: 50,
                        y: 132,
                      },
                      {
                        x: 20,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 3,
                  rowIndex: 0,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 24,
                            y: 185,
                          },
                          {
                            x: 49,
                            y: 185,
                          },
                          {
                            x: 49,
                            y: 200,
                          },
                          {
                            x: 24,
                            y: 200,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 24,
                                y: 185,
                              },
                              {
                                x: 49,
                                y: 185,
                              },
                              {
                                x: 49,
                                y: 200,
                              },
                              {
                                x: 24,
                                y: 200,
                              },
                            ],
                          },
                          inferText: "절삭",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 132,
                      },
                      {
                        x: 50,
                        y: 132,
                      },
                      {
                        x: 50,
                        y: 256,
                      },
                      {
                        x: 20,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 7,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 25,
                            y: 294,
                          },
                          {
                            x: 49,
                            y: 294,
                          },
                          {
                            x: 49,
                            y: 308,
                          },
                          {
                            x: 25,
                            y: 308,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 25,
                                y: 294,
                              },
                              {
                                x: 49,
                                y: 294,
                              },
                              {
                                x: 49,
                                y: 308,
                              },
                              {
                                x: 25,
                                y: 308,
                              },
                            ],
                          },
                          inferText: "단판",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 256,
                      },
                      {
                        x: 50,
                        y: 256,
                      },
                      {
                        x: 50,
                        y: 346,
                      },
                      {
                        x: 20,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 5,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 24,
                            y: 365,
                          },
                          {
                            x: 48,
                            y: 365,
                          },
                          {
                            x: 48,
                            y: 378,
                          },
                          {
                            x: 24,
                            y: 378,
                          },
                        ],
                      },
                      inferConfidence: 0.9998,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 24,
                                y: 365,
                              },
                              {
                                x: 48,
                                y: 365,
                              },
                              {
                                x: 48,
                                y: 378,
                              },
                              {
                                x: 24,
                                y: 378,
                              },
                            ],
                          },
                          inferText: "중판",
                          inferConfidence: 0.9998,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 346,
                      },
                      {
                        x: 50,
                        y: 346,
                      },
                      {
                        x: 50,
                        y: 400,
                      },
                      {
                        x: 20,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 0.9998,
                  rowSpan: 3,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 400,
                      },
                      {
                        x: 50,
                        y: 400,
                      },
                      {
                        x: 50,
                        y: 416,
                      },
                      {
                        x: 20,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 51,
                            y: 420,
                          },
                          {
                            x: 83,
                            y: 420,
                          },
                          {
                            x: 83,
                            y: 430,
                          },
                          {
                            x: 51,
                            y: 430,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 51,
                                y: 420,
                              },
                              {
                                x: 83,
                                y: 420,
                              },
                              {
                                x: 83,
                                y: 430,
                              },
                              {
                                x: 51,
                                y: 430,
                              },
                            ],
                          },
                          inferText: "A/B조",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 416,
                      },
                      {
                        x: 112,
                        y: 416,
                      },
                      {
                        x: 112,
                        y: 434,
                      },
                      {
                        x: 20,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 2,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 24,
                            y: 516,
                          },
                          {
                            x: 48,
                            y: 516,
                          },
                          {
                            x: 48,
                            y: 531,
                          },
                          {
                            x: 24,
                            y: 531,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 24,
                                y: 516,
                              },
                              {
                                x: 48,
                                y: 516,
                              },
                              {
                                x: 48,
                                y: 531,
                              },
                              {
                                x: 24,
                                y: 531,
                              },
                            ],
                          },
                          inferText: "접착",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 434,
                      },
                      {
                        x: 50,
                        y: 434,
                      },
                      {
                        x: 50,
                        y: 614,
                      },
                      {
                        x: 20,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 10,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 25,
                            y: 632,
                          },
                          {
                            x: 48,
                            y: 632,
                          },
                          {
                            x: 48,
                            y: 647,
                          },
                          {
                            x: 25,
                            y: 647,
                          },
                        ],
                      },
                      inferConfidence: 0.9991,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 25,
                                y: 632,
                              },
                              {
                                x: 48,
                                y: 632,
                              },
                              {
                                x: 48,
                                y: 647,
                              },
                              {
                                x: 25,
                                y: 647,
                              },
                            ],
                          },
                          inferText: "열압",
                          inferConfidence: 0.9991,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 614,
                      },
                      {
                        x: 50,
                        y: 614,
                      },
                      {
                        x: 50,
                        y: 666,
                      },
                      {
                        x: 20,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 0.9991,
                  rowSpan: 3,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 23,
                            y: 685,
                          },
                          {
                            x: 48,
                            y: 685,
                          },
                          {
                            x: 48,
                            y: 701,
                          },
                          {
                            x: 23,
                            y: 701,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 23,
                                y: 685,
                              },
                              {
                                x: 48,
                                y: 685,
                              },
                              {
                                x: 48,
                                y: 701,
                              },
                              {
                                x: 23,
                                y: 701,
                              },
                            ],
                          },
                          inferText: "수지",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 666,
                      },
                      {
                        x: 50,
                        y: 666,
                      },
                      {
                        x: 50,
                        y: 720,
                      },
                      {
                        x: 20,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 3,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 23,
                            y: 738,
                          },
                          {
                            x: 48,
                            y: 738,
                          },
                          {
                            x: 48,
                            y: 755,
                          },
                          {
                            x: 23,
                            y: 755,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 23,
                                y: 738,
                              },
                              {
                                x: 48,
                                y: 738,
                              },
                              {
                                x: 48,
                                y: 755,
                              },
                              {
                                x: 23,
                                y: 755,
                              },
                            ],
                          },
                          inferText: "검사",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 720,
                      },
                      {
                        x: 50,
                        y: 720,
                      },
                      {
                        x: 50,
                        y: 774,
                      },
                      {
                        x: 20,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 3,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 44,
                            y: 776,
                          },
                          {
                            x: 89,
                            y: 776,
                          },
                          {
                            x: 89,
                            y: 789,
                          },
                          {
                            x: 44,
                            y: 789,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 44,
                                y: 776,
                              },
                              {
                                x: 89,
                                y: 776,
                              },
                              {
                                x: 89,
                                y: 789,
                              },
                              {
                                x: 44,
                                y: 789,
                              },
                            ],
                          },
                          inferText: "불량매수",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 774,
                      },
                      {
                        x: 112,
                        y: 774,
                      },
                      {
                        x: 112,
                        y: 792,
                      },
                      {
                        x: 20,
                        y: 792,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 39,
                  columnSpan: 2,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 44,
                            y: 794,
                          },
                          {
                            x: 89,
                            y: 794,
                          },
                          {
                            x: 89,
                            y: 808,
                          },
                          {
                            x: 44,
                            y: 808,
                          },
                        ],
                      },
                      inferConfidence: 0.9988,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 44,
                                y: 794,
                              },
                              {
                                x: 89,
                                y: 794,
                              },
                              {
                                x: 89,
                                y: 808,
                              },
                              {
                                x: 44,
                                y: 808,
                              },
                            ],
                          },
                          inferText: "검사총량",
                          inferConfidence: 0.9988,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 792,
                      },
                      {
                        x: 112,
                        y: 792,
                      },
                      {
                        x: 112,
                        y: 810,
                      },
                      {
                        x: 20,
                        y: 810,
                      },
                    ],
                  },
                  inferConfidence: 0.9988,
                  rowSpan: 1,
                  rowIndex: 40,
                  columnSpan: 2,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 42,
                            y: 812,
                          },
                          {
                            x: 92,
                            y: 812,
                          },
                          {
                            x: 92,
                            y: 824,
                          },
                          {
                            x: 42,
                            y: 824,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 42,
                                y: 812,
                              },
                              {
                                x: 92,
                                y: 812,
                              },
                              {
                                x: 92,
                                y: 824,
                              },
                              {
                                x: 42,
                                y: 824,
                              },
                            ],
                          },
                          inferText: "불량율(%)",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 20,
                        y: 810,
                      },
                      {
                        x: 112,
                        y: 810,
                      },
                      {
                        x: 112,
                        y: 828,
                      },
                      {
                        x: 20,
                        y: 828,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 41,
                  columnSpan: 2,
                  columnIndex: 0,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 60,
                            y: 98,
                          },
                          {
                            x: 105,
                            y: 98,
                          },
                          {
                            x: 105,
                            y: 111,
                          },
                          {
                            x: 60,
                            y: 111,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 60,
                                y: 98,
                              },
                              {
                                x: 105,
                                y: 98,
                              },
                              {
                                x: 105,
                                y: 111,
                              },
                              {
                                x: 60,
                                y: 111,
                              },
                            ],
                          },
                          inferText: "불량내역",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 78,
                      },
                      {
                        x: 112,
                        y: 78,
                      },
                      {
                        x: 112,
                        y: 132,
                      },
                      {
                        x: 50,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 3,
                  rowIndex: 0,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 133,
                          },
                          {
                            x: 105,
                            y: 133,
                          },
                          {
                            x: 105,
                            y: 147,
                          },
                          {
                            x: 59,
                            y: 147,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 133,
                              },
                              {
                                x: 105,
                                y: 133,
                              },
                              {
                                x: 105,
                                y: 147,
                              },
                              {
                                x: 59,
                                y: 147,
                              },
                            ],
                          },
                          inferText: "거친절삭",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 132,
                      },
                      {
                        x: 112,
                        y: 132,
                      },
                      {
                        x: 112,
                        y: 150,
                      },
                      {
                        x: 50,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 65,
                            y: 152,
                          },
                          {
                            x: 100,
                            y: 152,
                          },
                          {
                            x: 100,
                            y: 165,
                          },
                          {
                            x: 65,
                            y: 165,
                          },
                        ],
                      },
                      inferConfidence: 0.9364,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 65,
                                y: 152,
                              },
                              {
                                x: 100,
                                y: 152,
                              },
                              {
                                x: 100,
                                y: 165,
                              },
                              {
                                x: 65,
                                y: 165,
                              },
                            ],
                          },
                          inferText: "칼자욱",
                          inferConfidence: 0.9364,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 150,
                      },
                      {
                        x: 112,
                        y: 150,
                      },
                      {
                        x: 112,
                        y: 168,
                      },
                      {
                        x: 50,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 0.9364,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 169,
                          },
                          {
                            x: 105,
                            y: 169,
                          },
                          {
                            x: 105,
                            y: 183,
                          },
                          {
                            x: 59,
                            y: 183,
                          },
                        ],
                      },
                      inferConfidence: 0.993,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 169,
                              },
                              {
                                x: 105,
                                y: 169,
                              },
                              {
                                x: 105,
                                y: 183,
                              },
                              {
                                x: 59,
                                y: 183,
                              },
                            ],
                          },
                          inferText: "중판후박",
                          inferConfidence: 0.993,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 168,
                      },
                      {
                        x: 112,
                        y: 168,
                      },
                      {
                        x: 112,
                        y: 184,
                      },
                      {
                        x: 50,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 0.993,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 187,
                          },
                          {
                            x: 105,
                            y: 187,
                          },
                          {
                            x: 105,
                            y: 201,
                          },
                          {
                            x: 59,
                            y: 201,
                          },
                        ],
                      },
                      inferConfidence: 0.9986,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 187,
                              },
                              {
                                x: 105,
                                y: 187,
                              },
                              {
                                x: 105,
                                y: 201,
                              },
                              {
                                x: 59,
                                y: 201,
                              },
                            ],
                          },
                          inferText: "파상단판",
                          inferConfidence: 0.9986,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 184,
                      },
                      {
                        x: 112,
                        y: 184,
                      },
                      {
                        x: 112,
                        y: 202,
                      },
                      {
                        x: 50,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 0.9986,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 205,
                          },
                          {
                            x: 105,
                            y: 205,
                          },
                          {
                            x: 105,
                            y: 219,
                          },
                          {
                            x: 59,
                            y: 219,
                          },
                        ],
                      },
                      inferConfidence: 0.999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 205,
                              },
                              {
                                x: 105,
                                y: 205,
                              },
                              {
                                x: 105,
                                y: 219,
                              },
                              {
                                x: 59,
                                y: 219,
                              },
                            ],
                          },
                          inferText: "파상중판",
                          inferConfidence: 0.999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 202,
                      },
                      {
                        x: 112,
                        y: 202,
                      },
                      {
                        x: 112,
                        y: 220,
                      },
                      {
                        x: 50,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 0.999,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 222,
                          },
                          {
                            x: 105,
                            y: 222,
                          },
                          {
                            x: 105,
                            y: 237,
                          },
                          {
                            x: 59,
                            y: 237,
                          },
                        ],
                      },
                      inferConfidence: 0.9981,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 222,
                              },
                              {
                                x: 105,
                                y: 222,
                              },
                              {
                                x: 105,
                                y: 237,
                              },
                              {
                                x: 59,
                                y: 237,
                              },
                            ],
                          },
                          inferText: "파상병판",
                          inferConfidence: 0.9981,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 220,
                      },
                      {
                        x: 112,
                        y: 220,
                      },
                      {
                        x: 112,
                        y: 238,
                      },
                      {
                        x: 50,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 0.9981,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 69,
                            y: 241,
                          },
                          {
                            x: 94,
                            y: 241,
                          },
                          {
                            x: 94,
                            y: 253,
                          },
                          {
                            x: 69,
                            y: 253,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 69,
                                y: 241,
                              },
                              {
                                x: 94,
                                y: 241,
                              },
                              {
                                x: 94,
                                y: 253,
                              },
                              {
                                x: 69,
                                y: 253,
                              },
                            ],
                          },
                          inferText: "오염",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 238,
                      },
                      {
                        x: 112,
                        y: 238,
                      },
                      {
                        x: 112,
                        y: 256,
                      },
                      {
                        x: 50,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 258,
                          },
                          {
                            x: 104,
                            y: 258,
                          },
                          {
                            x: 104,
                            y: 273,
                          },
                          {
                            x: 59,
                            y: 273,
                          },
                        ],
                      },
                      inferConfidence: 0.8682,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 258,
                              },
                              {
                                x: 104,
                                y: 258,
                              },
                              {
                                x: 104,
                                y: 273,
                              },
                              {
                                x: 59,
                                y: 273,
                              },
                            ],
                          },
                          inferText: "단판점침",
                          inferConfidence: 0.8682,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 256,
                      },
                      {
                        x: 112,
                        y: 256,
                      },
                      {
                        x: 112,
                        y: 274,
                      },
                      {
                        x: 50,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 0.8682,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 276,
                          },
                          {
                            x: 104,
                            y: 276,
                          },
                          {
                            x: 104,
                            y: 290,
                          },
                          {
                            x: 59,
                            y: 290,
                          },
                        ],
                      },
                      inferConfidence: 0.9998,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 276,
                              },
                              {
                                x: 104,
                                y: 276,
                              },
                              {
                                x: 104,
                                y: 290,
                              },
                              {
                                x: 59,
                                y: 290,
                              },
                            ],
                          },
                          inferText: "단판불량",
                          inferConfidence: 0.9998,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 274,
                      },
                      {
                        x: 112,
                        y: 274,
                      },
                      {
                        x: 112,
                        y: 292,
                      },
                      {
                        x: 50,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 0.9998,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 60,
                            y: 294,
                          },
                          {
                            x: 104,
                            y: 294,
                          },
                          {
                            x: 104,
                            y: 307,
                          },
                          {
                            x: 60,
                            y: 307,
                          },
                        ],
                      },
                      inferConfidence: 0.9571,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 60,
                                y: 294,
                              },
                              {
                                x: 104,
                                y: 294,
                              },
                              {
                                x: 104,
                                y: 307,
                              },
                              {
                                x: 60,
                                y: 307,
                              },
                            ],
                          },
                          inferText: "병판요철",
                          inferConfidence: 0.9571,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 292,
                      },
                      {
                        x: 112,
                        y: 292,
                      },
                      {
                        x: 112,
                        y: 310,
                      },
                      {
                        x: 50,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 0.9571,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 70,
                            y: 312,
                          },
                          {
                            x: 95,
                            y: 312,
                          },
                          {
                            x: 95,
                            y: 326,
                          },
                          {
                            x: 70,
                            y: 326,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 70,
                                y: 312,
                              },
                              {
                                x: 95,
                                y: 312,
                              },
                              {
                                x: 95,
                                y: 326,
                              },
                              {
                                x: 70,
                                y: 326,
                              },
                            ],
                          },
                          inferText: "갈림",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 310,
                      },
                      {
                        x: 112,
                        y: 310,
                      },
                      {
                        x: 112,
                        y: 328,
                      },
                      {
                        x: 50,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 69,
                            y: 329,
                          },
                          {
                            x: 95,
                            y: 329,
                          },
                          {
                            x: 95,
                            y: 344,
                          },
                          {
                            x: 69,
                            y: 344,
                          },
                        ],
                      },
                      inferConfidence: 0.9984,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 69,
                                y: 329,
                              },
                              {
                                x: 95,
                                y: 329,
                              },
                              {
                                x: 95,
                                y: 344,
                              },
                              {
                                x: 69,
                                y: 344,
                              },
                            ],
                          },
                          inferText: "만곡",
                          inferConfidence: 0.9984,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 328,
                      },
                      {
                        x: 112,
                        y: 328,
                      },
                      {
                        x: 112,
                        y: 346,
                      },
                      {
                        x: 50,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 0.9984,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 347,
                          },
                          {
                            x: 104,
                            y: 347,
                          },
                          {
                            x: 104,
                            y: 361,
                          },
                          {
                            x: 59,
                            y: 361,
                          },
                        ],
                      },
                      inferConfidence: 0.9943,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 347,
                              },
                              {
                                x: 104,
                                y: 347,
                              },
                              {
                                x: 104,
                                y: 361,
                              },
                              {
                                x: 59,
                                y: 361,
                              },
                            ],
                          },
                          inferText: "중판겹침",
                          inferConfidence: 0.9943,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 346,
                      },
                      {
                        x: 112,
                        y: 346,
                      },
                      {
                        x: 112,
                        y: 364,
                      },
                      {
                        x: 50,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 0.9943,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 366,
                          },
                          {
                            x: 104,
                            y: 366,
                          },
                          {
                            x: 104,
                            y: 378,
                          },
                          {
                            x: 59,
                            y: 378,
                          },
                        ],
                      },
                      inferConfidence: 0.9994,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 366,
                              },
                              {
                                x: 104,
                                y: 366,
                              },
                              {
                                x: 104,
                                y: 378,
                              },
                              {
                                x: 59,
                                y: 378,
                              },
                            ],
                          },
                          inferText: "두께불량",
                          inferConfidence: 0.9994,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 364,
                      },
                      {
                        x: 112,
                        y: 364,
                      },
                      {
                        x: 112,
                        y: 382,
                      },
                      {
                        x: 50,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 0.9994,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 383,
                          },
                          {
                            x: 104,
                            y: 383,
                          },
                          {
                            x: 104,
                            y: 396,
                          },
                          {
                            x: 59,
                            y: 396,
                          },
                        ],
                      },
                      inferConfidence: 0.9246,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 383,
                              },
                              {
                                x: 104,
                                y: 383,
                              },
                              {
                                x: 104,
                                y: 396,
                              },
                              {
                                x: 59,
                                y: 396,
                              },
                            ],
                          },
                          inferText: "중판요철",
                          inferConfidence: 0.9246,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 382,
                      },
                      {
                        x: 112,
                        y: 382,
                      },
                      {
                        x: 112,
                        y: 400,
                      },
                      {
                        x: 50,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 0.9246,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 49,
                            y: 400,
                          },
                          {
                            x: 85,
                            y: 400,
                          },
                          {
                            x: 85,
                            y: 414,
                          },
                          {
                            x: 49,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 49,
                                y: 400,
                              },
                              {
                                x: 85,
                                y: 400,
                              },
                              {
                                x: 85,
                                y: 414,
                              },
                              {
                                x: 49,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "기계명",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 400,
                      },
                      {
                        x: 112,
                        y: 400,
                      },
                      {
                        x: 112,
                        y: 416,
                      },
                      {
                        x: 50,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 70,
                            y: 437,
                          },
                          {
                            x: 95,
                            y: 437,
                          },
                          {
                            x: 95,
                            y: 451,
                          },
                          {
                            x: 70,
                            y: 451,
                          },
                        ],
                      },
                      inferConfidence: 0.9996,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 70,
                                y: 437,
                              },
                              {
                                x: 95,
                                y: 437,
                              },
                              {
                                x: 95,
                                y: 451,
                              },
                              {
                                x: 70,
                                y: 451,
                              },
                            ],
                          },
                          inferText: "목편",
                          inferConfidence: 0.9996,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 434,
                      },
                      {
                        x: 112,
                        y: 434,
                      },
                      {
                        x: 112,
                        y: 452,
                      },
                      {
                        x: 50,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 0.9996,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 454,
                          },
                          {
                            x: 104,
                            y: 454,
                          },
                          {
                            x: 104,
                            y: 469,
                          },
                          {
                            x: 59,
                            y: 469,
                          },
                        ],
                      },
                      inferConfidence: 0.9815,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 454,
                              },
                              {
                                x: 104,
                                y: 454,
                              },
                              {
                                x: 104,
                                y: 469,
                              },
                              {
                                x: 59,
                                y: 469,
                              },
                            ],
                          },
                          inferText: "단판겹침",
                          inferConfidence: 0.9815,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 452,
                      },
                      {
                        x: 112,
                        y: 452,
                      },
                      {
                        x: 112,
                        y: 470,
                      },
                      {
                        x: 50,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 0.9815,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 58,
                            y: 472,
                          },
                          {
                            x: 104,
                            y: 472,
                          },
                          {
                            x: 104,
                            y: 487,
                          },
                          {
                            x: 58,
                            y: 487,
                          },
                        ],
                      },
                      inferConfidence: 0.9899,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 58,
                                y: 472,
                              },
                              {
                                x: 104,
                                y: 472,
                              },
                              {
                                x: 104,
                                y: 487,
                              },
                              {
                                x: 58,
                                y: 487,
                              },
                            ],
                          },
                          inferText: "중판겹침",
                          inferConfidence: 0.9899,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 470,
                      },
                      {
                        x: 112,
                        y: 470,
                      },
                      {
                        x: 112,
                        y: 488,
                      },
                      {
                        x: 50,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 0.9899,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 58,
                            y: 490,
                          },
                          {
                            x: 104,
                            y: 490,
                          },
                          {
                            x: 104,
                            y: 504,
                          },
                          {
                            x: 58,
                            y: 504,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 58,
                                y: 490,
                              },
                              {
                                x: 104,
                                y: 490,
                              },
                              {
                                x: 104,
                                y: 504,
                              },
                              {
                                x: 58,
                                y: 504,
                              },
                            ],
                          },
                          inferText: "단부길이",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 488,
                      },
                      {
                        x: 112,
                        y: 488,
                      },
                      {
                        x: 112,
                        y: 506,
                      },
                      {
                        x: 50,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 508,
                          },
                          {
                            x: 104,
                            y: 508,
                          },
                          {
                            x: 104,
                            y: 522,
                          },
                          {
                            x: 59,
                            y: 522,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 508,
                              },
                              {
                                x: 104,
                                y: 508,
                              },
                              {
                                x: 104,
                                y: 522,
                              },
                              {
                                x: 59,
                                y: 522,
                              },
                            ],
                          },
                          inferText: "단부머리",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 506,
                      },
                      {
                        x: 112,
                        y: 506,
                      },
                      {
                        x: 112,
                        y: 524,
                      },
                      {
                        x: 50,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 58,
                            y: 526,
                          },
                          {
                            x: 104,
                            y: 526,
                          },
                          {
                            x: 104,
                            y: 540,
                          },
                          {
                            x: 58,
                            y: 540,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 58,
                                y: 526,
                              },
                              {
                                x: 104,
                                y: 526,
                              },
                              {
                                x: 104,
                                y: 540,
                              },
                              {
                                x: 58,
                                y: 540,
                              },
                            ],
                          },
                          inferText: "중부길이",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 524,
                      },
                      {
                        x: 112,
                        y: 524,
                      },
                      {
                        x: 112,
                        y: 542,
                      },
                      {
                        x: 50,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 58,
                            y: 544,
                          },
                          {
                            x: 104,
                            y: 544,
                          },
                          {
                            x: 104,
                            y: 558,
                          },
                          {
                            x: 58,
                            y: 558,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 58,
                                y: 544,
                              },
                              {
                                x: 104,
                                y: 544,
                              },
                              {
                                x: 104,
                                y: 558,
                              },
                              {
                                x: 58,
                                y: 558,
                              },
                            ],
                          },
                          inferText: "중부머리",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 542,
                      },
                      {
                        x: 112,
                        y: 542,
                      },
                      {
                        x: 112,
                        y: 560,
                      },
                      {
                        x: 50,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 562,
                          },
                          {
                            x: 104,
                            y: 562,
                          },
                          {
                            x: 104,
                            y: 575,
                          },
                          {
                            x: 59,
                            y: 575,
                          },
                        ],
                      },
                      inferConfidence: 0.9996,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 562,
                              },
                              {
                                x: 104,
                                y: 562,
                              },
                              {
                                x: 104,
                                y: 575,
                              },
                              {
                                x: 59,
                                y: 575,
                              },
                            ],
                          },
                          inferText: "병판부족",
                          inferConfidence: 0.9996,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 560,
                      },
                      {
                        x: 112,
                        y: 560,
                      },
                      {
                        x: 112,
                        y: 578,
                      },
                      {
                        x: 50,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 0.9996,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 70,
                            y: 580,
                          },
                          {
                            x: 94,
                            y: 580,
                          },
                          {
                            x: 94,
                            y: 593,
                          },
                          {
                            x: 70,
                            y: 593,
                          },
                        ],
                      },
                      inferConfidence: 0.9924,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 70,
                                y: 580,
                              },
                              {
                                x: 94,
                                y: 580,
                              },
                              {
                                x: 94,
                                y: 593,
                              },
                              {
                                x: 70,
                                y: 593,
                              },
                            ],
                          },
                          inferText: "벌림",
                          inferConfidence: 0.9924,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 578,
                      },
                      {
                        x: 112,
                        y: 578,
                      },
                      {
                        x: 112,
                        y: 596,
                      },
                      {
                        x: 50,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 0.9924,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 64,
                            y: 597,
                          },
                          {
                            x: 99,
                            y: 597,
                          },
                          {
                            x: 99,
                            y: 611,
                          },
                          {
                            x: 64,
                            y: 611,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 64,
                                y: 597,
                              },
                              {
                                x: 99,
                                y: 597,
                              },
                              {
                                x: 99,
                                y: 611,
                              },
                              {
                                x: 64,
                                y: 611,
                              },
                            ],
                          },
                          inferText: "실자리",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 596,
                      },
                      {
                        x: 112,
                        y: 596,
                      },
                      {
                        x: 112,
                        y: 614,
                      },
                      {
                        x: 50,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 69,
                            y: 615,
                          },
                          {
                            x: 95,
                            y: 615,
                          },
                          {
                            x: 95,
                            y: 629,
                          },
                          {
                            x: 69,
                            y: 629,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 69,
                                y: 615,
                              },
                              {
                                x: 95,
                                y: 615,
                              },
                              {
                                x: 95,
                                y: 629,
                              },
                              {
                                x: 69,
                                y: 629,
                              },
                            ],
                          },
                          inferText: "파손",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 614,
                      },
                      {
                        x: 112,
                        y: 614,
                      },
                      {
                        x: 112,
                        y: 630,
                      },
                      {
                        x: 50,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 69,
                            y: 633,
                          },
                          {
                            x: 94,
                            y: 633,
                          },
                          {
                            x: 94,
                            y: 647,
                          },
                          {
                            x: 69,
                            y: 647,
                          },
                        ],
                      },
                      inferConfidence: 0.9657,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 69,
                                y: 633,
                              },
                              {
                                x: 94,
                                y: 633,
                              },
                              {
                                x: 94,
                                y: 647,
                              },
                              {
                                x: 69,
                                y: 647,
                              },
                            ],
                          },
                          inferText: "늘림",
                          inferConfidence: 0.9657,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 630,
                      },
                      {
                        x: 112,
                        y: 630,
                      },
                      {
                        x: 112,
                        y: 648,
                      },
                      {
                        x: 50,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 0.9657,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 65,
                            y: 651,
                          },
                          {
                            x: 99,
                            y: 651,
                          },
                          {
                            x: 99,
                            y: 665,
                          },
                          {
                            x: 65,
                            y: 665,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 65,
                                y: 651,
                              },
                              {
                                x: 99,
                                y: 651,
                              },
                              {
                                x: 99,
                                y: 665,
                              },
                              {
                                x: 65,
                                y: 665,
                              },
                            ],
                          },
                          inferText: "절단기",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 648,
                      },
                      {
                        x: 112,
                        y: 648,
                      },
                      {
                        x: 112,
                        y: 666,
                      },
                      {
                        x: 50,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 668,
                          },
                          {
                            x: 105,
                            y: 668,
                          },
                          {
                            x: 105,
                            y: 683,
                          },
                          {
                            x: 59,
                            y: 683,
                          },
                        ],
                      },
                      inferConfidence: 0.9665,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 668,
                              },
                              {
                                x: 105,
                                y: 668,
                              },
                              {
                                x: 105,
                                y: 683,
                              },
                              {
                                x: 59,
                                y: 683,
                              },
                            ],
                          },
                          inferText: "접불가장",
                          inferConfidence: 0.9665,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 666,
                      },
                      {
                        x: 112,
                        y: 666,
                      },
                      {
                        x: 112,
                        y: 684,
                      },
                      {
                        x: 50,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 0.9665,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 686,
                          },
                          {
                            x: 105,
                            y: 686,
                          },
                          {
                            x: 105,
                            y: 701,
                          },
                          {
                            x: 59,
                            y: 701,
                          },
                        ],
                      },
                      inferConfidence: 0.8745,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 686,
                              },
                              {
                                x: 105,
                                y: 686,
                              },
                              {
                                x: 105,
                                y: 701,
                              },
                              {
                                x: 59,
                                y: 701,
                              },
                            ],
                          },
                          inferText: "접불수포",
                          inferConfidence: 0.8745,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 684,
                      },
                      {
                        x: 112,
                        y: 684,
                      },
                      {
                        x: 112,
                        y: 702,
                      },
                      {
                        x: 50,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 0.8745,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 59,
                            y: 704,
                          },
                          {
                            x: 104,
                            y: 704,
                          },
                          {
                            x: 104,
                            y: 717,
                          },
                          {
                            x: 59,
                            y: 717,
                          },
                        ],
                      },
                      inferConfidence: 0.9846,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 59,
                                y: 704,
                              },
                              {
                                x: 104,
                                y: 704,
                              },
                              {
                                x: 104,
                                y: 717,
                              },
                              {
                                x: 59,
                                y: 717,
                              },
                            ],
                          },
                          inferText: "냉압불량",
                          inferConfidence: 0.9846,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 702,
                      },
                      {
                        x: 112,
                        y: 702,
                      },
                      {
                        x: 112,
                        y: 720,
                      },
                      {
                        x: 50,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 0.9846,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 65,
                            y: 722,
                          },
                          {
                            x: 99,
                            y: 722,
                          },
                          {
                            x: 99,
                            y: 737,
                          },
                          {
                            x: 65,
                            y: 737,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 65,
                                y: 722,
                              },
                              {
                                x: 99,
                                y: 722,
                              },
                              {
                                x: 99,
                                y: 737,
                              },
                              {
                                x: 65,
                                y: 737,
                              },
                            ],
                          },
                          inferText: "연삭기",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 720,
                      },
                      {
                        x: 112,
                        y: 720,
                      },
                      {
                        x: 112,
                        y: 738,
                      },
                      {
                        x: 50,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 69,
                            y: 740,
                          },
                          {
                            x: 94,
                            y: 740,
                          },
                          {
                            x: 94,
                            y: 755,
                          },
                          {
                            x: 69,
                            y: 755,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 69,
                                y: 740,
                              },
                              {
                                x: 94,
                                y: 740,
                              },
                              {
                                x: 94,
                                y: 755,
                              },
                              {
                                x: 69,
                                y: 755,
                              },
                            ],
                          },
                          inferText: "빠데",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 738,
                      },
                      {
                        x: 112,
                        y: 738,
                      },
                      {
                        x: 112,
                        y: 756,
                      },
                      {
                        x: 50,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 68,
                            y: 758,
                          },
                          {
                            x: 95,
                            y: 758,
                          },
                          {
                            x: 95,
                            y: 772,
                          },
                          {
                            x: 68,
                            y: 772,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 68,
                                y: 758,
                              },
                              {
                                x: 95,
                                y: 758,
                              },
                              {
                                x: 95,
                                y: 772,
                              },
                              {
                                x: 68,
                                y: 772,
                              },
                            ],
                          },
                          inferText: "파손",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 50,
                        y: 756,
                      },
                      {
                        x: 112,
                        y: 756,
                      },
                      {
                        x: 112,
                        y: 774,
                      },
                      {
                        x: 50,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 1,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 146,
                            y: 81,
                          },
                          {
                            x: 238,
                            y: 81,
                          },
                          {
                            x: 238,
                            y: 95,
                          },
                          {
                            x: 146,
                            y: 95,
                          },
                        ],
                      },
                      inferConfidence: 0.9831,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 146,
                                y: 81,
                              },
                              {
                                x: 238,
                                y: 81,
                              },
                              {
                                x: 238,
                                y: 95,
                              },
                              {
                                x: 146,
                                y: 95,
                              },
                            ],
                          },
                          inferText: "3×6×18",
                          inferConfidence: 0.9831,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 78,
                      },
                      {
                        x: 192,
                        y: 78,
                      },
                      {
                        x: 192,
                        y: 96,
                      },
                      {
                        x: 112,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 0.9831,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 3,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 165,
                            y: 98,
                          },
                          {
                            x: 218,
                            y: 98,
                          },
                          {
                            x: 218,
                            y: 114,
                          },
                          {
                            x: 165,
                            y: 114,
                          },
                        ],
                      },
                      inferConfidence: 0.7822,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 165,
                                y: 98,
                              },
                              {
                                x: 218,
                                y: 98,
                              },
                              {
                                x: 218,
                                y: 114,
                              },
                              {
                                x: 165,
                                y: 114,
                              },
                            ],
                          },
                          inferText: "조선개",
                          inferConfidence: 0.7822,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 96,
                      },
                      {
                        x: 260,
                        y: 96,
                      },
                      {
                        x: 260,
                        y: 114,
                      },
                      {
                        x: 112,
                        y: 114,
                      },
                    ],
                  },
                  inferConfidence: 0.7822,
                  rowSpan: 1,
                  rowIndex: 1,
                  columnSpan: 7,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 121,
                            y: 117,
                          },
                          {
                            x: 132,
                            y: 117,
                          },
                          {
                            x: 132,
                            y: 128,
                          },
                          {
                            x: 121,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 121,
                                y: 117,
                              },
                              {
                                x: 132,
                                y: 117,
                              },
                              {
                                x: 132,
                                y: 128,
                              },
                              {
                                x: 121,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 114,
                      },
                      {
                        x: 142,
                        y: 114,
                      },
                      {
                        x: 142,
                        y: 132,
                      },
                      {
                        x: 112,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 132,
                      },
                      {
                        x: 142,
                        y: 132,
                      },
                      {
                        x: 142,
                        y: 150,
                      },
                      {
                        x: 112,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 150,
                      },
                      {
                        x: 142,
                        y: 150,
                      },
                      {
                        x: 142,
                        y: 168,
                      },
                      {
                        x: 112,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 168,
                      },
                      {
                        x: 142,
                        y: 168,
                      },
                      {
                        x: 142,
                        y: 184,
                      },
                      {
                        x: 112,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 184,
                      },
                      {
                        x: 142,
                        y: 184,
                      },
                      {
                        x: 142,
                        y: 202,
                      },
                      {
                        x: 112,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 202,
                      },
                      {
                        x: 142,
                        y: 202,
                      },
                      {
                        x: 142,
                        y: 220,
                      },
                      {
                        x: 112,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 220,
                      },
                      {
                        x: 142,
                        y: 220,
                      },
                      {
                        x: 142,
                        y: 238,
                      },
                      {
                        x: 112,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 238,
                      },
                      {
                        x: 142,
                        y: 238,
                      },
                      {
                        x: 142,
                        y: 256,
                      },
                      {
                        x: 112,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 256,
                      },
                      {
                        x: 142,
                        y: 256,
                      },
                      {
                        x: 142,
                        y: 274,
                      },
                      {
                        x: 112,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 274,
                      },
                      {
                        x: 142,
                        y: 274,
                      },
                      {
                        x: 142,
                        y: 292,
                      },
                      {
                        x: 112,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 292,
                      },
                      {
                        x: 142,
                        y: 292,
                      },
                      {
                        x: 142,
                        y: 310,
                      },
                      {
                        x: 112,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 310,
                      },
                      {
                        x: 142,
                        y: 310,
                      },
                      {
                        x: 142,
                        y: 328,
                      },
                      {
                        x: 112,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 328,
                      },
                      {
                        x: 142,
                        y: 328,
                      },
                      {
                        x: 142,
                        y: 346,
                      },
                      {
                        x: 112,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 346,
                      },
                      {
                        x: 142,
                        y: 346,
                      },
                      {
                        x: 142,
                        y: 364,
                      },
                      {
                        x: 112,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 364,
                      },
                      {
                        x: 142,
                        y: 364,
                      },
                      {
                        x: 142,
                        y: 382,
                      },
                      {
                        x: 112,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 382,
                      },
                      {
                        x: 142,
                        y: 382,
                      },
                      {
                        x: 142,
                        y: 400,
                      },
                      {
                        x: 112,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 123,
                            y: 401,
                          },
                          {
                            x: 161,
                            y: 401,
                          },
                          {
                            x: 161,
                            y: 414,
                          },
                          {
                            x: 123,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 123,
                                y: 401,
                              },
                              {
                                x: 161,
                                y: 401,
                              },
                              {
                                x: 161,
                                y: 414,
                              },
                              {
                                x: 123,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "GS 3호",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 400,
                      },
                      {
                        x: 172,
                        y: 400,
                      },
                      {
                        x: 172,
                        y: 416,
                      },
                      {
                        x: 112,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 2,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 120,
                            y: 420,
                          },
                          {
                            x: 133,
                            y: 420,
                          },
                          {
                            x: 133,
                            y: 433,
                          },
                          {
                            x: 120,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 120,
                                y: 420,
                              },
                              {
                                x: 133,
                                y: 420,
                              },
                              {
                                x: 133,
                                y: 433,
                              },
                              {
                                x: 120,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 416,
                      },
                      {
                        x: 142,
                        y: 416,
                      },
                      {
                        x: 142,
                        y: 434,
                      },
                      {
                        x: 112,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 434,
                      },
                      {
                        x: 142,
                        y: 434,
                      },
                      {
                        x: 142,
                        y: 452,
                      },
                      {
                        x: 112,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 452,
                      },
                      {
                        x: 142,
                        y: 452,
                      },
                      {
                        x: 142,
                        y: 470,
                      },
                      {
                        x: 112,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 470,
                      },
                      {
                        x: 142,
                        y: 470,
                      },
                      {
                        x: 142,
                        y: 488,
                      },
                      {
                        x: 112,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 488,
                      },
                      {
                        x: 142,
                        y: 488,
                      },
                      {
                        x: 142,
                        y: 506,
                      },
                      {
                        x: 112,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 506,
                      },
                      {
                        x: 142,
                        y: 506,
                      },
                      {
                        x: 142,
                        y: 524,
                      },
                      {
                        x: 112,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 524,
                      },
                      {
                        x: 142,
                        y: 524,
                      },
                      {
                        x: 142,
                        y: 542,
                      },
                      {
                        x: 112,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 542,
                      },
                      {
                        x: 142,
                        y: 542,
                      },
                      {
                        x: 142,
                        y: 560,
                      },
                      {
                        x: 112,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 560,
                      },
                      {
                        x: 142,
                        y: 560,
                      },
                      {
                        x: 142,
                        y: 578,
                      },
                      {
                        x: 112,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 578,
                      },
                      {
                        x: 142,
                        y: 578,
                      },
                      {
                        x: 142,
                        y: 596,
                      },
                      {
                        x: 112,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 596,
                      },
                      {
                        x: 142,
                        y: 596,
                      },
                      {
                        x: 142,
                        y: 614,
                      },
                      {
                        x: 112,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 614,
                      },
                      {
                        x: 142,
                        y: 614,
                      },
                      {
                        x: 142,
                        y: 630,
                      },
                      {
                        x: 112,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 122,
                            y: 636,
                          },
                          {
                            x: 134,
                            y: 636,
                          },
                          {
                            x: 134,
                            y: 647,
                          },
                          {
                            x: 122,
                            y: 647,
                          },
                        ],
                      },
                      inferConfidence: 0.997,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 122,
                                y: 636,
                              },
                              {
                                x: 134,
                                y: 636,
                              },
                              {
                                x: 134,
                                y: 647,
                              },
                              {
                                x: 122,
                                y: 647,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 0.997,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 630,
                      },
                      {
                        x: 142,
                        y: 630,
                      },
                      {
                        x: 142,
                        y: 648,
                      },
                      {
                        x: 112,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 0.997,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 648,
                      },
                      {
                        x: 142,
                        y: 648,
                      },
                      {
                        x: 142,
                        y: 666,
                      },
                      {
                        x: 112,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 666,
                      },
                      {
                        x: 142,
                        y: 666,
                      },
                      {
                        x: 142,
                        y: 684,
                      },
                      {
                        x: 112,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 684,
                      },
                      {
                        x: 142,
                        y: 684,
                      },
                      {
                        x: 142,
                        y: 702,
                      },
                      {
                        x: 112,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 120,
                            y: 707,
                          },
                          {
                            x: 133,
                            y: 707,
                          },
                          {
                            x: 133,
                            y: 719,
                          },
                          {
                            x: 120,
                            y: 719,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 120,
                                y: 707,
                              },
                              {
                                x: 133,
                                y: 707,
                              },
                              {
                                x: 133,
                                y: 719,
                              },
                              {
                                x: 120,
                                y: 719,
                              },
                            ],
                          },
                          inferText: "3",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 702,
                      },
                      {
                        x: 142,
                        y: 702,
                      },
                      {
                        x: 142,
                        y: 720,
                      },
                      {
                        x: 112,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 720,
                      },
                      {
                        x: 142,
                        y: 720,
                      },
                      {
                        x: 142,
                        y: 738,
                      },
                      {
                        x: 112,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 738,
                      },
                      {
                        x: 142,
                        y: 738,
                      },
                      {
                        x: 142,
                        y: 756,
                      },
                      {
                        x: 112,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 756,
                      },
                      {
                        x: 142,
                        y: 756,
                      },
                      {
                        x: 142,
                        y: 774,
                      },
                      {
                        x: 112,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 173,
                            y: 780,
                          },
                          {
                            x: 194,
                            y: 780,
                          },
                          {
                            x: 194,
                            y: 791,
                          },
                          {
                            x: 173,
                            y: 791,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 173,
                                y: 780,
                              },
                              {
                                x: 194,
                                y: 780,
                              },
                              {
                                x: 194,
                                y: 791,
                              },
                              {
                                x: 173,
                                y: 791,
                              },
                            ],
                          },
                          inferText: "37",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 774,
                      },
                      {
                        x: 260,
                        y: 774,
                      },
                      {
                        x: 260,
                        y: 792,
                      },
                      {
                        x: 112,
                        y: 792,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 39,
                  columnSpan: 7,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 168,
                            y: 799,
                          },
                          {
                            x: 201,
                            y: 799,
                          },
                          {
                            x: 201,
                            y: 809,
                          },
                          {
                            x: 168,
                            y: 809,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 168,
                                y: 799,
                              },
                              {
                                x: 201,
                                y: 799,
                              },
                              {
                                x: 201,
                                y: 809,
                              },
                              {
                                x: 168,
                                y: 809,
                              },
                            ],
                          },
                          inferText: "1060",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 792,
                      },
                      {
                        x: 260,
                        y: 792,
                      },
                      {
                        x: 260,
                        y: 810,
                      },
                      {
                        x: 112,
                        y: 810,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 40,
                  columnSpan: 7,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 164,
                            y: 815,
                          },
                          {
                            x: 194,
                            y: 812,
                          },
                          {
                            x: 195,
                            y: 822,
                          },
                          {
                            x: 165,
                            y: 825,
                          },
                        ],
                      },
                      inferConfidence: 0.7109,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 164,
                                y: 815,
                              },
                              {
                                x: 194,
                                y: 812,
                              },
                              {
                                x: 195,
                                y: 822,
                              },
                              {
                                x: 165,
                                y: 825,
                              },
                            ],
                          },
                          inferText: "24",
                          inferConfidence: 0.7109,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 112,
                        y: 810,
                      },
                      {
                        x: 260,
                        y: 810,
                      },
                      {
                        x: 260,
                        y: 828,
                      },
                      {
                        x: 112,
                        y: 828,
                      },
                    ],
                  },
                  inferConfidence: 0.7109,
                  rowSpan: 1,
                  rowIndex: 41,
                  columnSpan: 7,
                  columnIndex: 2,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 152,
                            y: 116,
                          },
                          {
                            x: 164,
                            y: 116,
                          },
                          {
                            x: 164,
                            y: 130,
                          },
                          {
                            x: 152,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 0.9869,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 152,
                                y: 116,
                              },
                              {
                                x: 164,
                                y: 116,
                              },
                              {
                                x: 164,
                                y: 130,
                              },
                              {
                                x: 152,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9869,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 114,
                      },
                      {
                        x: 172,
                        y: 114,
                      },
                      {
                        x: 172,
                        y: 132,
                      },
                      {
                        x: 142,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9869,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 132,
                      },
                      {
                        x: 172,
                        y: 132,
                      },
                      {
                        x: 172,
                        y: 150,
                      },
                      {
                        x: 142,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 150,
                      },
                      {
                        x: 172,
                        y: 150,
                      },
                      {
                        x: 172,
                        y: 168,
                      },
                      {
                        x: 142,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 168,
                      },
                      {
                        x: 172,
                        y: 168,
                      },
                      {
                        x: 172,
                        y: 184,
                      },
                      {
                        x: 142,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 184,
                      },
                      {
                        x: 172,
                        y: 184,
                      },
                      {
                        x: 172,
                        y: 202,
                      },
                      {
                        x: 142,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 202,
                      },
                      {
                        x: 172,
                        y: 202,
                      },
                      {
                        x: 172,
                        y: 220,
                      },
                      {
                        x: 142,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 220,
                      },
                      {
                        x: 172,
                        y: 220,
                      },
                      {
                        x: 172,
                        y: 238,
                      },
                      {
                        x: 142,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 238,
                      },
                      {
                        x: 172,
                        y: 238,
                      },
                      {
                        x: 172,
                        y: 256,
                      },
                      {
                        x: 142,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 256,
                      },
                      {
                        x: 172,
                        y: 256,
                      },
                      {
                        x: 172,
                        y: 274,
                      },
                      {
                        x: 142,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 274,
                      },
                      {
                        x: 172,
                        y: 274,
                      },
                      {
                        x: 172,
                        y: 292,
                      },
                      {
                        x: 142,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 292,
                      },
                      {
                        x: 172,
                        y: 292,
                      },
                      {
                        x: 172,
                        y: 310,
                      },
                      {
                        x: 142,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 310,
                      },
                      {
                        x: 172,
                        y: 310,
                      },
                      {
                        x: 172,
                        y: 328,
                      },
                      {
                        x: 142,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 328,
                      },
                      {
                        x: 172,
                        y: 328,
                      },
                      {
                        x: 172,
                        y: 346,
                      },
                      {
                        x: 142,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 346,
                      },
                      {
                        x: 172,
                        y: 346,
                      },
                      {
                        x: 172,
                        y: 364,
                      },
                      {
                        x: 142,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 364,
                      },
                      {
                        x: 172,
                        y: 364,
                      },
                      {
                        x: 172,
                        y: 382,
                      },
                      {
                        x: 142,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 382,
                      },
                      {
                        x: 172,
                        y: 382,
                      },
                      {
                        x: 172,
                        y: 400,
                      },
                      {
                        x: 142,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 153,
                            y: 420,
                          },
                          {
                            x: 163,
                            y: 420,
                          },
                          {
                            x: 163,
                            y: 432,
                          },
                          {
                            x: 153,
                            y: 432,
                          },
                        ],
                      },
                      inferConfidence: 0.975,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 153,
                                y: 420,
                              },
                              {
                                x: 163,
                                y: 420,
                              },
                              {
                                x: 163,
                                y: 432,
                              },
                              {
                                x: 153,
                                y: 432,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.975,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 416,
                      },
                      {
                        x: 172,
                        y: 416,
                      },
                      {
                        x: 172,
                        y: 434,
                      },
                      {
                        x: 142,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.975,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 434,
                      },
                      {
                        x: 172,
                        y: 434,
                      },
                      {
                        x: 172,
                        y: 452,
                      },
                      {
                        x: 142,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 452,
                      },
                      {
                        x: 172,
                        y: 452,
                      },
                      {
                        x: 172,
                        y: 470,
                      },
                      {
                        x: 142,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 470,
                      },
                      {
                        x: 172,
                        y: 470,
                      },
                      {
                        x: 172,
                        y: 488,
                      },
                      {
                        x: 142,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 488,
                      },
                      {
                        x: 172,
                        y: 488,
                      },
                      {
                        x: 172,
                        y: 506,
                      },
                      {
                        x: 142,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 506,
                      },
                      {
                        x: 172,
                        y: 506,
                      },
                      {
                        x: 172,
                        y: 524,
                      },
                      {
                        x: 142,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 524,
                      },
                      {
                        x: 172,
                        y: 524,
                      },
                      {
                        x: 172,
                        y: 542,
                      },
                      {
                        x: 142,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 542,
                      },
                      {
                        x: 172,
                        y: 542,
                      },
                      {
                        x: 172,
                        y: 560,
                      },
                      {
                        x: 142,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 560,
                      },
                      {
                        x: 172,
                        y: 560,
                      },
                      {
                        x: 172,
                        y: 578,
                      },
                      {
                        x: 142,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 578,
                      },
                      {
                        x: 172,
                        y: 578,
                      },
                      {
                        x: 172,
                        y: 596,
                      },
                      {
                        x: 142,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 596,
                      },
                      {
                        x: 172,
                        y: 596,
                      },
                      {
                        x: 172,
                        y: 614,
                      },
                      {
                        x: 142,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 614,
                      },
                      {
                        x: 172,
                        y: 614,
                      },
                      {
                        x: 172,
                        y: 630,
                      },
                      {
                        x: 142,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 630,
                      },
                      {
                        x: 172,
                        y: 630,
                      },
                      {
                        x: 172,
                        y: 648,
                      },
                      {
                        x: 142,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 648,
                      },
                      {
                        x: 172,
                        y: 648,
                      },
                      {
                        x: 172,
                        y: 666,
                      },
                      {
                        x: 142,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 666,
                      },
                      {
                        x: 172,
                        y: 666,
                      },
                      {
                        x: 172,
                        y: 684,
                      },
                      {
                        x: 142,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 684,
                      },
                      {
                        x: 172,
                        y: 684,
                      },
                      {
                        x: 172,
                        y: 702,
                      },
                      {
                        x: 142,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 702,
                      },
                      {
                        x: 172,
                        y: 702,
                      },
                      {
                        x: 172,
                        y: 720,
                      },
                      {
                        x: 142,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 720,
                      },
                      {
                        x: 172,
                        y: 720,
                      },
                      {
                        x: 172,
                        y: 738,
                      },
                      {
                        x: 142,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 738,
                      },
                      {
                        x: 172,
                        y: 738,
                      },
                      {
                        x: 172,
                        y: 756,
                      },
                      {
                        x: 142,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 142,
                        y: 756,
                      },
                      {
                        x: 172,
                        y: 756,
                      },
                      {
                        x: 172,
                        y: 774,
                      },
                      {
                        x: 142,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 3,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 180,
                            y: 117,
                          },
                          {
                            x: 191,
                            y: 117,
                          },
                          {
                            x: 191,
                            y: 128,
                          },
                          {
                            x: 180,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 180,
                                y: 117,
                              },
                              {
                                x: 191,
                                y: 117,
                              },
                              {
                                x: 191,
                                y: 128,
                              },
                              {
                                x: 180,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 114,
                      },
                      {
                        x: 202,
                        y: 114,
                      },
                      {
                        x: 202,
                        y: 132,
                      },
                      {
                        x: 172,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 132,
                      },
                      {
                        x: 202,
                        y: 132,
                      },
                      {
                        x: 202,
                        y: 150,
                      },
                      {
                        x: 172,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 150,
                      },
                      {
                        x: 202,
                        y: 150,
                      },
                      {
                        x: 202,
                        y: 168,
                      },
                      {
                        x: 172,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 168,
                      },
                      {
                        x: 202,
                        y: 168,
                      },
                      {
                        x: 202,
                        y: 184,
                      },
                      {
                        x: 172,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 184,
                      },
                      {
                        x: 202,
                        y: 184,
                      },
                      {
                        x: 202,
                        y: 202,
                      },
                      {
                        x: 172,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 202,
                      },
                      {
                        x: 202,
                        y: 202,
                      },
                      {
                        x: 202,
                        y: 220,
                      },
                      {
                        x: 172,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 220,
                      },
                      {
                        x: 202,
                        y: 220,
                      },
                      {
                        x: 202,
                        y: 238,
                      },
                      {
                        x: 172,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 238,
                      },
                      {
                        x: 202,
                        y: 238,
                      },
                      {
                        x: 202,
                        y: 256,
                      },
                      {
                        x: 172,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 256,
                      },
                      {
                        x: 202,
                        y: 256,
                      },
                      {
                        x: 202,
                        y: 274,
                      },
                      {
                        x: 172,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 274,
                      },
                      {
                        x: 202,
                        y: 274,
                      },
                      {
                        x: 202,
                        y: 292,
                      },
                      {
                        x: 172,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 292,
                      },
                      {
                        x: 202,
                        y: 292,
                      },
                      {
                        x: 202,
                        y: 310,
                      },
                      {
                        x: 172,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 310,
                      },
                      {
                        x: 202,
                        y: 310,
                      },
                      {
                        x: 202,
                        y: 328,
                      },
                      {
                        x: 172,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 328,
                      },
                      {
                        x: 202,
                        y: 328,
                      },
                      {
                        x: 202,
                        y: 346,
                      },
                      {
                        x: 172,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 346,
                      },
                      {
                        x: 202,
                        y: 346,
                      },
                      {
                        x: 202,
                        y: 364,
                      },
                      {
                        x: 172,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 364,
                      },
                      {
                        x: 202,
                        y: 364,
                      },
                      {
                        x: 202,
                        y: 382,
                      },
                      {
                        x: 172,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 382,
                      },
                      {
                        x: 202,
                        y: 382,
                      },
                      {
                        x: 202,
                        y: 400,
                      },
                      {
                        x: 172,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 183,
                            y: 401,
                          },
                          {
                            x: 220,
                            y: 401,
                          },
                          {
                            x: 220,
                            y: 414,
                          },
                          {
                            x: 183,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 0.9993,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 183,
                                y: 401,
                              },
                              {
                                x: 220,
                                y: 401,
                              },
                              {
                                x: 220,
                                y: 414,
                              },
                              {
                                x: 183,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "GS 4호",
                          inferConfidence: 0.9993,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 400,
                      },
                      {
                        x: 232,
                        y: 400,
                      },
                      {
                        x: 232,
                        y: 416,
                      },
                      {
                        x: 172,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 0.9993,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 4,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 179,
                            y: 420,
                          },
                          {
                            x: 192,
                            y: 420,
                          },
                          {
                            x: 192,
                            y: 433,
                          },
                          {
                            x: 179,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 179,
                                y: 420,
                              },
                              {
                                x: 192,
                                y: 420,
                              },
                              {
                                x: 192,
                                y: 433,
                              },
                              {
                                x: 179,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 416,
                      },
                      {
                        x: 202,
                        y: 416,
                      },
                      {
                        x: 202,
                        y: 434,
                      },
                      {
                        x: 172,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 434,
                      },
                      {
                        x: 202,
                        y: 434,
                      },
                      {
                        x: 202,
                        y: 452,
                      },
                      {
                        x: 172,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 452,
                      },
                      {
                        x: 202,
                        y: 452,
                      },
                      {
                        x: 202,
                        y: 470,
                      },
                      {
                        x: 172,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 470,
                      },
                      {
                        x: 202,
                        y: 470,
                      },
                      {
                        x: 202,
                        y: 488,
                      },
                      {
                        x: 172,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 488,
                      },
                      {
                        x: 202,
                        y: 488,
                      },
                      {
                        x: 202,
                        y: 506,
                      },
                      {
                        x: 172,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 506,
                      },
                      {
                        x: 202,
                        y: 506,
                      },
                      {
                        x: 202,
                        y: 524,
                      },
                      {
                        x: 172,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 524,
                      },
                      {
                        x: 202,
                        y: 524,
                      },
                      {
                        x: 202,
                        y: 542,
                      },
                      {
                        x: 172,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 542,
                      },
                      {
                        x: 202,
                        y: 542,
                      },
                      {
                        x: 202,
                        y: 560,
                      },
                      {
                        x: 172,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 560,
                      },
                      {
                        x: 202,
                        y: 560,
                      },
                      {
                        x: 202,
                        y: 578,
                      },
                      {
                        x: 172,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 578,
                      },
                      {
                        x: 202,
                        y: 578,
                      },
                      {
                        x: 202,
                        y: 596,
                      },
                      {
                        x: 172,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 596,
                      },
                      {
                        x: 202,
                        y: 596,
                      },
                      {
                        x: 202,
                        y: 614,
                      },
                      {
                        x: 172,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 614,
                      },
                      {
                        x: 202,
                        y: 614,
                      },
                      {
                        x: 202,
                        y: 630,
                      },
                      {
                        x: 172,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 630,
                      },
                      {
                        x: 202,
                        y: 630,
                      },
                      {
                        x: 202,
                        y: 648,
                      },
                      {
                        x: 172,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 648,
                      },
                      {
                        x: 202,
                        y: 648,
                      },
                      {
                        x: 202,
                        y: 666,
                      },
                      {
                        x: 172,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 182,
                            y: 669,
                          },
                          {
                            x: 194,
                            y: 669,
                          },
                          {
                            x: 194,
                            y: 683,
                          },
                          {
                            x: 182,
                            y: 683,
                          },
                        ],
                      },
                      inferConfidence: 0.8534,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 182,
                                y: 669,
                              },
                              {
                                x: 194,
                                y: 669,
                              },
                              {
                                x: 194,
                                y: 683,
                              },
                              {
                                x: 182,
                                y: 683,
                              },
                            ],
                          },
                          inferText: "+",
                          inferConfidence: 0.8534,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 666,
                      },
                      {
                        x: 202,
                        y: 666,
                      },
                      {
                        x: 202,
                        y: 684,
                      },
                      {
                        x: 172,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 0.8534,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 684,
                      },
                      {
                        x: 202,
                        y: 684,
                      },
                      {
                        x: 202,
                        y: 702,
                      },
                      {
                        x: 172,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 702,
                      },
                      {
                        x: 202,
                        y: 702,
                      },
                      {
                        x: 202,
                        y: 720,
                      },
                      {
                        x: 172,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 720,
                      },
                      {
                        x: 202,
                        y: 720,
                      },
                      {
                        x: 202,
                        y: 738,
                      },
                      {
                        x: 172,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 738,
                      },
                      {
                        x: 202,
                        y: 738,
                      },
                      {
                        x: 202,
                        y: 756,
                      },
                      {
                        x: 172,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 172,
                        y: 756,
                      },
                      {
                        x: 202,
                        y: 756,
                      },
                      {
                        x: 202,
                        y: 774,
                      },
                      {
                        x: 172,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 2,
                  columnIndex: 4,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 192,
                        y: 78,
                      },
                      {
                        x: 220,
                        y: 78,
                      },
                      {
                        x: 220,
                        y: 96,
                      },
                      {
                        x: 192,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 2,
                  columnIndex: 5,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 213,
                            y: 117,
                          },
                          {
                            x: 223,
                            y: 117,
                          },
                          {
                            x: 223,
                            y: 128,
                          },
                          {
                            x: 213,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 0.9981,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 213,
                                y: 117,
                              },
                              {
                                x: 223,
                                y: 117,
                              },
                              {
                                x: 223,
                                y: 128,
                              },
                              {
                                x: 213,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9981,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 114,
                      },
                      {
                        x: 232,
                        y: 114,
                      },
                      {
                        x: 232,
                        y: 132,
                      },
                      {
                        x: 202,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9981,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 132,
                      },
                      {
                        x: 232,
                        y: 132,
                      },
                      {
                        x: 232,
                        y: 150,
                      },
                      {
                        x: 202,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 150,
                      },
                      {
                        x: 232,
                        y: 150,
                      },
                      {
                        x: 232,
                        y: 168,
                      },
                      {
                        x: 202,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 168,
                      },
                      {
                        x: 232,
                        y: 168,
                      },
                      {
                        x: 232,
                        y: 184,
                      },
                      {
                        x: 202,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 184,
                      },
                      {
                        x: 232,
                        y: 184,
                      },
                      {
                        x: 232,
                        y: 202,
                      },
                      {
                        x: 202,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 202,
                      },
                      {
                        x: 232,
                        y: 202,
                      },
                      {
                        x: 232,
                        y: 220,
                      },
                      {
                        x: 202,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 220,
                      },
                      {
                        x: 232,
                        y: 220,
                      },
                      {
                        x: 232,
                        y: 238,
                      },
                      {
                        x: 202,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 238,
                      },
                      {
                        x: 232,
                        y: 238,
                      },
                      {
                        x: 232,
                        y: 256,
                      },
                      {
                        x: 202,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 256,
                      },
                      {
                        x: 232,
                        y: 256,
                      },
                      {
                        x: 232,
                        y: 274,
                      },
                      {
                        x: 202,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 274,
                      },
                      {
                        x: 232,
                        y: 274,
                      },
                      {
                        x: 232,
                        y: 292,
                      },
                      {
                        x: 202,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 292,
                      },
                      {
                        x: 232,
                        y: 292,
                      },
                      {
                        x: 232,
                        y: 310,
                      },
                      {
                        x: 202,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 310,
                      },
                      {
                        x: 232,
                        y: 310,
                      },
                      {
                        x: 232,
                        y: 328,
                      },
                      {
                        x: 202,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 328,
                      },
                      {
                        x: 232,
                        y: 328,
                      },
                      {
                        x: 232,
                        y: 346,
                      },
                      {
                        x: 202,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 346,
                      },
                      {
                        x: 232,
                        y: 346,
                      },
                      {
                        x: 232,
                        y: 364,
                      },
                      {
                        x: 202,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 364,
                      },
                      {
                        x: 232,
                        y: 364,
                      },
                      {
                        x: 232,
                        y: 382,
                      },
                      {
                        x: 202,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 382,
                      },
                      {
                        x: 232,
                        y: 382,
                      },
                      {
                        x: 232,
                        y: 400,
                      },
                      {
                        x: 202,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 213,
                            y: 420,
                          },
                          {
                            x: 222,
                            y: 420,
                          },
                          {
                            x: 222,
                            y: 432,
                          },
                          {
                            x: 213,
                            y: 432,
                          },
                        ],
                      },
                      inferConfidence: 0.987,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 213,
                                y: 420,
                              },
                              {
                                x: 222,
                                y: 420,
                              },
                              {
                                x: 222,
                                y: 432,
                              },
                              {
                                x: 213,
                                y: 432,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.987,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 416,
                      },
                      {
                        x: 232,
                        y: 416,
                      },
                      {
                        x: 232,
                        y: 434,
                      },
                      {
                        x: 202,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.987,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 434,
                      },
                      {
                        x: 232,
                        y: 434,
                      },
                      {
                        x: 232,
                        y: 452,
                      },
                      {
                        x: 202,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 452,
                      },
                      {
                        x: 232,
                        y: 452,
                      },
                      {
                        x: 232,
                        y: 470,
                      },
                      {
                        x: 202,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 470,
                      },
                      {
                        x: 232,
                        y: 470,
                      },
                      {
                        x: 232,
                        y: 488,
                      },
                      {
                        x: 202,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 488,
                      },
                      {
                        x: 232,
                        y: 488,
                      },
                      {
                        x: 232,
                        y: 506,
                      },
                      {
                        x: 202,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 506,
                      },
                      {
                        x: 232,
                        y: 506,
                      },
                      {
                        x: 232,
                        y: 524,
                      },
                      {
                        x: 202,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 524,
                      },
                      {
                        x: 232,
                        y: 524,
                      },
                      {
                        x: 232,
                        y: 542,
                      },
                      {
                        x: 202,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 542,
                      },
                      {
                        x: 232,
                        y: 542,
                      },
                      {
                        x: 232,
                        y: 560,
                      },
                      {
                        x: 202,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 560,
                      },
                      {
                        x: 232,
                        y: 560,
                      },
                      {
                        x: 232,
                        y: 578,
                      },
                      {
                        x: 202,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 578,
                      },
                      {
                        x: 232,
                        y: 578,
                      },
                      {
                        x: 232,
                        y: 596,
                      },
                      {
                        x: 202,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 596,
                      },
                      {
                        x: 232,
                        y: 596,
                      },
                      {
                        x: 232,
                        y: 614,
                      },
                      {
                        x: 202,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 614,
                      },
                      {
                        x: 232,
                        y: 614,
                      },
                      {
                        x: 232,
                        y: 630,
                      },
                      {
                        x: 202,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 630,
                      },
                      {
                        x: 232,
                        y: 630,
                      },
                      {
                        x: 232,
                        y: 648,
                      },
                      {
                        x: 202,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 648,
                      },
                      {
                        x: 232,
                        y: 648,
                      },
                      {
                        x: 232,
                        y: 666,
                      },
                      {
                        x: 202,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 212,
                            y: 673,
                          },
                          {
                            x: 221,
                            y: 673,
                          },
                          {
                            x: 221,
                            y: 682,
                          },
                          {
                            x: 212,
                            y: 682,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 212,
                                y: 673,
                              },
                              {
                                x: 221,
                                y: 673,
                              },
                              {
                                x: 221,
                                y: 682,
                              },
                              {
                                x: 212,
                                y: 682,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 666,
                      },
                      {
                        x: 232,
                        y: 666,
                      },
                      {
                        x: 232,
                        y: 684,
                      },
                      {
                        x: 202,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 684,
                      },
                      {
                        x: 232,
                        y: 684,
                      },
                      {
                        x: 232,
                        y: 702,
                      },
                      {
                        x: 202,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 702,
                      },
                      {
                        x: 232,
                        y: 702,
                      },
                      {
                        x: 232,
                        y: 720,
                      },
                      {
                        x: 202,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 720,
                      },
                      {
                        x: 232,
                        y: 720,
                      },
                      {
                        x: 232,
                        y: 738,
                      },
                      {
                        x: 202,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 738,
                      },
                      {
                        x: 232,
                        y: 738,
                      },
                      {
                        x: 232,
                        y: 756,
                      },
                      {
                        x: 202,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 202,
                        y: 756,
                      },
                      {
                        x: 232,
                        y: 756,
                      },
                      {
                        x: 232,
                        y: 774,
                      },
                      {
                        x: 202,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 2,
                  columnIndex: 6,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 220,
                        y: 78,
                      },
                      {
                        x: 260,
                        y: 78,
                      },
                      {
                        x: 260,
                        y: 96,
                      },
                      {
                        x: 220,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 2,
                  columnIndex: 7,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 240,
                            y: 116,
                          },
                          {
                            x: 253,
                            y: 116,
                          },
                          {
                            x: 253,
                            y: 128,
                          },
                          {
                            x: 240,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 0.8597,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 240,
                                y: 116,
                              },
                              {
                                x: 253,
                                y: 116,
                              },
                              {
                                x: 253,
                                y: 128,
                              },
                              {
                                x: 240,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 0.8597,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 114,
                      },
                      {
                        x: 260,
                        y: 114,
                      },
                      {
                        x: 260,
                        y: 132,
                      },
                      {
                        x: 232,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.8597,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 132,
                      },
                      {
                        x: 260,
                        y: 132,
                      },
                      {
                        x: 260,
                        y: 150,
                      },
                      {
                        x: 232,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 150,
                      },
                      {
                        x: 260,
                        y: 150,
                      },
                      {
                        x: 260,
                        y: 168,
                      },
                      {
                        x: 232,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 168,
                      },
                      {
                        x: 260,
                        y: 168,
                      },
                      {
                        x: 260,
                        y: 184,
                      },
                      {
                        x: 232,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 184,
                      },
                      {
                        x: 260,
                        y: 184,
                      },
                      {
                        x: 260,
                        y: 202,
                      },
                      {
                        x: 232,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 202,
                      },
                      {
                        x: 260,
                        y: 202,
                      },
                      {
                        x: 260,
                        y: 220,
                      },
                      {
                        x: 232,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 220,
                      },
                      {
                        x: 260,
                        y: 220,
                      },
                      {
                        x: 260,
                        y: 238,
                      },
                      {
                        x: 232,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 238,
                      },
                      {
                        x: 260,
                        y: 238,
                      },
                      {
                        x: 260,
                        y: 256,
                      },
                      {
                        x: 232,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 256,
                      },
                      {
                        x: 260,
                        y: 256,
                      },
                      {
                        x: 260,
                        y: 274,
                      },
                      {
                        x: 232,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 274,
                      },
                      {
                        x: 260,
                        y: 274,
                      },
                      {
                        x: 260,
                        y: 292,
                      },
                      {
                        x: 232,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 292,
                      },
                      {
                        x: 260,
                        y: 292,
                      },
                      {
                        x: 260,
                        y: 310,
                      },
                      {
                        x: 232,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 310,
                      },
                      {
                        x: 260,
                        y: 310,
                      },
                      {
                        x: 260,
                        y: 328,
                      },
                      {
                        x: 232,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 328,
                      },
                      {
                        x: 260,
                        y: 328,
                      },
                      {
                        x: 260,
                        y: 346,
                      },
                      {
                        x: 232,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 346,
                      },
                      {
                        x: 260,
                        y: 346,
                      },
                      {
                        x: 260,
                        y: 364,
                      },
                      {
                        x: 232,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 364,
                      },
                      {
                        x: 260,
                        y: 364,
                      },
                      {
                        x: 260,
                        y: 382,
                      },
                      {
                        x: 232,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 382,
                      },
                      {
                        x: 260,
                        y: 382,
                      },
                      {
                        x: 260,
                        y: 400,
                      },
                      {
                        x: 232,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 240,
                            y: 411,
                          },
                          {
                            x: 252,
                            y: 411,
                          },
                          {
                            x: 252,
                            y: 422,
                          },
                          {
                            x: 240,
                            y: 422,
                          },
                        ],
                      },
                      inferConfidence: 0.9901,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 240,
                                y: 411,
                              },
                              {
                                x: 252,
                                y: 411,
                              },
                              {
                                x: 252,
                                y: 422,
                              },
                              {
                                x: 240,
                                y: 422,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 0.9901,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 400,
                      },
                      {
                        x: 260,
                        y: 400,
                      },
                      {
                        x: 260,
                        y: 434,
                      },
                      {
                        x: 232,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.9901,
                  rowSpan: 2,
                  rowIndex: 18,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 434,
                      },
                      {
                        x: 260,
                        y: 434,
                      },
                      {
                        x: 260,
                        y: 452,
                      },
                      {
                        x: 232,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 452,
                      },
                      {
                        x: 260,
                        y: 452,
                      },
                      {
                        x: 260,
                        y: 470,
                      },
                      {
                        x: 232,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 470,
                      },
                      {
                        x: 260,
                        y: 470,
                      },
                      {
                        x: 260,
                        y: 488,
                      },
                      {
                        x: 232,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 488,
                      },
                      {
                        x: 260,
                        y: 488,
                      },
                      {
                        x: 260,
                        y: 506,
                      },
                      {
                        x: 232,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 506,
                      },
                      {
                        x: 260,
                        y: 506,
                      },
                      {
                        x: 260,
                        y: 524,
                      },
                      {
                        x: 232,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 524,
                      },
                      {
                        x: 260,
                        y: 524,
                      },
                      {
                        x: 260,
                        y: 542,
                      },
                      {
                        x: 232,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 542,
                      },
                      {
                        x: 260,
                        y: 542,
                      },
                      {
                        x: 260,
                        y: 560,
                      },
                      {
                        x: 232,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 560,
                      },
                      {
                        x: 260,
                        y: 560,
                      },
                      {
                        x: 260,
                        y: 578,
                      },
                      {
                        x: 232,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 578,
                      },
                      {
                        x: 260,
                        y: 578,
                      },
                      {
                        x: 260,
                        y: 596,
                      },
                      {
                        x: 232,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 596,
                      },
                      {
                        x: 260,
                        y: 596,
                      },
                      {
                        x: 260,
                        y: 614,
                      },
                      {
                        x: 232,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 614,
                      },
                      {
                        x: 260,
                        y: 614,
                      },
                      {
                        x: 260,
                        y: 630,
                      },
                      {
                        x: 232,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 630,
                      },
                      {
                        x: 260,
                        y: 630,
                      },
                      {
                        x: 260,
                        y: 648,
                      },
                      {
                        x: 232,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 648,
                      },
                      {
                        x: 260,
                        y: 648,
                      },
                      {
                        x: 260,
                        y: 666,
                      },
                      {
                        x: 232,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 666,
                      },
                      {
                        x: 260,
                        y: 666,
                      },
                      {
                        x: 260,
                        y: 684,
                      },
                      {
                        x: 232,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 684,
                      },
                      {
                        x: 260,
                        y: 684,
                      },
                      {
                        x: 260,
                        y: 702,
                      },
                      {
                        x: 232,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 702,
                      },
                      {
                        x: 260,
                        y: 702,
                      },
                      {
                        x: 260,
                        y: 720,
                      },
                      {
                        x: 232,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 720,
                      },
                      {
                        x: 260,
                        y: 720,
                      },
                      {
                        x: 260,
                        y: 738,
                      },
                      {
                        x: 232,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 738,
                      },
                      {
                        x: 260,
                        y: 738,
                      },
                      {
                        x: 260,
                        y: 756,
                      },
                      {
                        x: 232,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 232,
                        y: 756,
                      },
                      {
                        x: 260,
                        y: 756,
                      },
                      {
                        x: 260,
                        y: 774,
                      },
                      {
                        x: 232,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 8,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 294,
                            y: 81,
                          },
                          {
                            x: 381,
                            y: 81,
                          },
                          {
                            x: 381,
                            y: 95,
                          },
                          {
                            x: 294,
                            y: 95,
                          },
                        ],
                      },
                      inferConfidence: 0.9914,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 294,
                                y: 81,
                              },
                              {
                                x: 381,
                                y: 81,
                              },
                              {
                                x: 381,
                                y: 95,
                              },
                              {
                                x: 294,
                                y: 95,
                              },
                            ],
                          },
                          inferText: "3×6×12",
                          inferConfidence: 0.9914,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 78,
                      },
                      {
                        x: 340,
                        y: 78,
                      },
                      {
                        x: 340,
                        y: 96,
                      },
                      {
                        x: 260,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 0.9914,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 3,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 307,
                            y: 101,
                          },
                          {
                            x: 388,
                            y: 99,
                          },
                          {
                            x: 388,
                            y: 112,
                          },
                          {
                            x: 307,
                            y: 115,
                          },
                        ],
                      },
                      inferConfidence: 0.90475,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 307,
                                y: 101,
                              },
                              {
                                x: 327,
                                y: 101,
                              },
                              {
                                x: 327,
                                y: 114,
                              },
                              {
                                x: 307,
                                y: 114,
                              },
                            ],
                          },
                          inferText: "CP",
                          inferConfidence: 0.8191,
                        },
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 343,
                                y: 100,
                              },
                              {
                                x: 388,
                                y: 100,
                              },
                              {
                                x: 388,
                                y: 112,
                              },
                              {
                                x: 343,
                                y: 112,
                              },
                            ],
                          },
                          inferText: "(테크)",
                          inferConfidence: 0.9904,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 96,
                      },
                      {
                        x: 410,
                        y: 96,
                      },
                      {
                        x: 410,
                        y: 114,
                      },
                      {
                        x: 260,
                        y: 114,
                      },
                    ],
                  },
                  inferConfidence: 0.90475,
                  rowSpan: 1,
                  rowIndex: 1,
                  columnSpan: 7,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 268,
                            y: 116,
                          },
                          {
                            x: 282,
                            y: 116,
                          },
                          {
                            x: 282,
                            y: 130,
                          },
                          {
                            x: 268,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 268,
                                y: 116,
                              },
                              {
                                x: 282,
                                y: 116,
                              },
                              {
                                x: 282,
                                y: 130,
                              },
                              {
                                x: 268,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 114,
                      },
                      {
                        x: 290,
                        y: 114,
                      },
                      {
                        x: 290,
                        y: 132,
                      },
                      {
                        x: 260,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 132,
                      },
                      {
                        x: 290,
                        y: 132,
                      },
                      {
                        x: 290,
                        y: 150,
                      },
                      {
                        x: 260,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 150,
                      },
                      {
                        x: 290,
                        y: 150,
                      },
                      {
                        x: 290,
                        y: 168,
                      },
                      {
                        x: 260,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 168,
                      },
                      {
                        x: 290,
                        y: 168,
                      },
                      {
                        x: 290,
                        y: 184,
                      },
                      {
                        x: 260,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 184,
                      },
                      {
                        x: 290,
                        y: 184,
                      },
                      {
                        x: 290,
                        y: 202,
                      },
                      {
                        x: 260,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 202,
                      },
                      {
                        x: 290,
                        y: 202,
                      },
                      {
                        x: 290,
                        y: 220,
                      },
                      {
                        x: 260,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 220,
                      },
                      {
                        x: 290,
                        y: 220,
                      },
                      {
                        x: 290,
                        y: 238,
                      },
                      {
                        x: 260,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 238,
                      },
                      {
                        x: 290,
                        y: 238,
                      },
                      {
                        x: 290,
                        y: 256,
                      },
                      {
                        x: 260,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 256,
                      },
                      {
                        x: 290,
                        y: 256,
                      },
                      {
                        x: 290,
                        y: 274,
                      },
                      {
                        x: 260,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 274,
                      },
                      {
                        x: 290,
                        y: 274,
                      },
                      {
                        x: 290,
                        y: 292,
                      },
                      {
                        x: 260,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 292,
                      },
                      {
                        x: 290,
                        y: 292,
                      },
                      {
                        x: 290,
                        y: 310,
                      },
                      {
                        x: 260,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 310,
                      },
                      {
                        x: 290,
                        y: 310,
                      },
                      {
                        x: 290,
                        y: 328,
                      },
                      {
                        x: 260,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 328,
                      },
                      {
                        x: 290,
                        y: 328,
                      },
                      {
                        x: 290,
                        y: 346,
                      },
                      {
                        x: 260,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 346,
                      },
                      {
                        x: 290,
                        y: 346,
                      },
                      {
                        x: 290,
                        y: 364,
                      },
                      {
                        x: 260,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 364,
                      },
                      {
                        x: 290,
                        y: 364,
                      },
                      {
                        x: 290,
                        y: 382,
                      },
                      {
                        x: 260,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 272,
                            y: 384,
                          },
                          {
                            x: 286,
                            y: 384,
                          },
                          {
                            x: 286,
                            y: 397,
                          },
                          {
                            x: 272,
                            y: 397,
                          },
                        ],
                      },
                      inferConfidence: 0.9992,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 272,
                                y: 384,
                              },
                              {
                                x: 286,
                                y: 384,
                              },
                              {
                                x: 286,
                                y: 397,
                              },
                              {
                                x: 272,
                                y: 397,
                              },
                            ],
                          },
                          inferText: "13",
                          inferConfidence: 0.9992,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 382,
                      },
                      {
                        x: 290,
                        y: 382,
                      },
                      {
                        x: 290,
                        y: 400,
                      },
                      {
                        x: 260,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 0.9992,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 273,
                            y: 401,
                          },
                          {
                            x: 309,
                            y: 401,
                          },
                          {
                            x: 309,
                            y: 414,
                          },
                          {
                            x: 273,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 0.9996,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 273,
                                y: 401,
                              },
                              {
                                x: 309,
                                y: 401,
                              },
                              {
                                x: 309,
                                y: 414,
                              },
                              {
                                x: 273,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "GS 3호",
                          inferConfidence: 0.9996,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 400,
                      },
                      {
                        x: 320,
                        y: 400,
                      },
                      {
                        x: 320,
                        y: 416,
                      },
                      {
                        x: 260,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 0.9996,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 2,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 269,
                            y: 420,
                          },
                          {
                            x: 282,
                            y: 420,
                          },
                          {
                            x: 282,
                            y: 433,
                          },
                          {
                            x: 269,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 269,
                                y: 420,
                              },
                              {
                                x: 282,
                                y: 420,
                              },
                              {
                                x: 282,
                                y: 433,
                              },
                              {
                                x: 269,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 416,
                      },
                      {
                        x: 290,
                        y: 416,
                      },
                      {
                        x: 290,
                        y: 434,
                      },
                      {
                        x: 260,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 434,
                      },
                      {
                        x: 290,
                        y: 434,
                      },
                      {
                        x: 290,
                        y: 452,
                      },
                      {
                        x: 260,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 452,
                      },
                      {
                        x: 290,
                        y: 452,
                      },
                      {
                        x: 290,
                        y: 470,
                      },
                      {
                        x: 260,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 470,
                      },
                      {
                        x: 290,
                        y: 470,
                      },
                      {
                        x: 290,
                        y: 488,
                      },
                      {
                        x: 260,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 488,
                      },
                      {
                        x: 290,
                        y: 488,
                      },
                      {
                        x: 290,
                        y: 506,
                      },
                      {
                        x: 260,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 506,
                      },
                      {
                        x: 290,
                        y: 506,
                      },
                      {
                        x: 290,
                        y: 524,
                      },
                      {
                        x: 260,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 270,
                            y: 526,
                          },
                          {
                            x: 282,
                            y: 526,
                          },
                          {
                            x: 282,
                            y: 541,
                          },
                          {
                            x: 270,
                            y: 541,
                          },
                        ],
                      },
                      inferConfidence: 0.9909,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 270,
                                y: 526,
                              },
                              {
                                x: 282,
                                y: 526,
                              },
                              {
                                x: 282,
                                y: 541,
                              },
                              {
                                x: 270,
                                y: 541,
                              },
                            ],
                          },
                          inferText: "9",
                          inferConfidence: 0.9909,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 524,
                      },
                      {
                        x: 290,
                        y: 524,
                      },
                      {
                        x: 290,
                        y: 542,
                      },
                      {
                        x: 260,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 0.9909,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 542,
                      },
                      {
                        x: 290,
                        y: 542,
                      },
                      {
                        x: 290,
                        y: 560,
                      },
                      {
                        x: 260,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 560,
                      },
                      {
                        x: 290,
                        y: 560,
                      },
                      {
                        x: 290,
                        y: 578,
                      },
                      {
                        x: 260,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 578,
                      },
                      {
                        x: 290,
                        y: 578,
                      },
                      {
                        x: 290,
                        y: 596,
                      },
                      {
                        x: 260,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 596,
                      },
                      {
                        x: 290,
                        y: 596,
                      },
                      {
                        x: 290,
                        y: 614,
                      },
                      {
                        x: 260,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 614,
                      },
                      {
                        x: 290,
                        y: 614,
                      },
                      {
                        x: 290,
                        y: 630,
                      },
                      {
                        x: 260,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 630,
                      },
                      {
                        x: 290,
                        y: 630,
                      },
                      {
                        x: 290,
                        y: 648,
                      },
                      {
                        x: 260,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 648,
                      },
                      {
                        x: 290,
                        y: 648,
                      },
                      {
                        x: 290,
                        y: 666,
                      },
                      {
                        x: 260,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 666,
                      },
                      {
                        x: 290,
                        y: 666,
                      },
                      {
                        x: 290,
                        y: 684,
                      },
                      {
                        x: 260,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 684,
                      },
                      {
                        x: 290,
                        y: 684,
                      },
                      {
                        x: 290,
                        y: 702,
                      },
                      {
                        x: 260,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 273,
                            y: 709,
                          },
                          {
                            x: 281,
                            y: 709,
                          },
                          {
                            x: 281,
                            y: 717,
                          },
                          {
                            x: 273,
                            y: 717,
                          },
                        ],
                      },
                      inferConfidence: 0.999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 273,
                                y: 709,
                              },
                              {
                                x: 281,
                                y: 709,
                              },
                              {
                                x: 281,
                                y: 717,
                              },
                              {
                                x: 273,
                                y: 717,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 0.999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 702,
                      },
                      {
                        x: 290,
                        y: 702,
                      },
                      {
                        x: 290,
                        y: 720,
                      },
                      {
                        x: 260,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 0.999,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 720,
                      },
                      {
                        x: 290,
                        y: 720,
                      },
                      {
                        x: 290,
                        y: 738,
                      },
                      {
                        x: 260,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 738,
                      },
                      {
                        x: 290,
                        y: 738,
                      },
                      {
                        x: 290,
                        y: 756,
                      },
                      {
                        x: 260,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 756,
                      },
                      {
                        x: 290,
                        y: 756,
                      },
                      {
                        x: 290,
                        y: 774,
                      },
                      {
                        x: 260,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 320,
                            y: 780,
                          },
                          {
                            x: 344,
                            y: 780,
                          },
                          {
                            x: 344,
                            y: 791,
                          },
                          {
                            x: 320,
                            y: 791,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 320,
                                y: 780,
                              },
                              {
                                x: 344,
                                y: 780,
                              },
                              {
                                x: 344,
                                y: 791,
                              },
                              {
                                x: 320,
                                y: 791,
                              },
                            ],
                          },
                          inferText: "49",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 774,
                      },
                      {
                        x: 410,
                        y: 774,
                      },
                      {
                        x: 410,
                        y: 792,
                      },
                      {
                        x: 260,
                        y: 792,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 39,
                  columnSpan: 7,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 306,
                            y: 797,
                          },
                          {
                            x: 343,
                            y: 797,
                          },
                          {
                            x: 343,
                            y: 809,
                          },
                          {
                            x: 306,
                            y: 809,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 306,
                                y: 797,
                              },
                              {
                                x: 343,
                                y: 797,
                              },
                              {
                                x: 343,
                                y: 809,
                              },
                              {
                                x: 306,
                                y: 809,
                              },
                            ],
                          },
                          inferText: "3.114",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 792,
                      },
                      {
                        x: 410,
                        y: 792,
                      },
                      {
                        x: 410,
                        y: 810,
                      },
                      {
                        x: 260,
                        y: 810,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 40,
                  columnSpan: 7,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 307,
                            y: 812,
                          },
                          {
                            x: 343,
                            y: 812,
                          },
                          {
                            x: 343,
                            y: 827,
                          },
                          {
                            x: 307,
                            y: 827,
                          },
                        ],
                      },
                      inferConfidence: 0.94,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 307,
                                y: 814,
                              },
                              {
                                x: 325,
                                y: 814,
                              },
                              {
                                x: 325,
                                y: 827,
                              },
                              {
                                x: 307,
                                y: 827,
                              },
                            ],
                          },
                          inferText: "4.",
                          inferConfidence: 0.88,
                        },
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 325,
                                y: 812,
                              },
                              {
                                x: 343,
                                y: 812,
                              },
                              {
                                x: 343,
                                y: 824,
                              },
                              {
                                x: 325,
                                y: 824,
                              },
                            ],
                          },
                          inferText: "78",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 260,
                        y: 810,
                      },
                      {
                        x: 410,
                        y: 810,
                      },
                      {
                        x: 410,
                        y: 828,
                      },
                      {
                        x: 260,
                        y: 828,
                      },
                    ],
                  },
                  inferConfidence: 0.94,
                  rowSpan: 1,
                  rowIndex: 41,
                  columnSpan: 7,
                  columnIndex: 9,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 303,
                            y: 117,
                          },
                          {
                            x: 312,
                            y: 117,
                          },
                          {
                            x: 312,
                            y: 129,
                          },
                          {
                            x: 303,
                            y: 129,
                          },
                        ],
                      },
                      inferConfidence: 0.985,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 303,
                                y: 117,
                              },
                              {
                                x: 312,
                                y: 117,
                              },
                              {
                                x: 312,
                                y: 129,
                              },
                              {
                                x: 303,
                                y: 129,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.985,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 114,
                      },
                      {
                        x: 320,
                        y: 114,
                      },
                      {
                        x: 320,
                        y: 132,
                      },
                      {
                        x: 290,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.985,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 132,
                      },
                      {
                        x: 320,
                        y: 132,
                      },
                      {
                        x: 320,
                        y: 150,
                      },
                      {
                        x: 290,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 150,
                      },
                      {
                        x: 320,
                        y: 150,
                      },
                      {
                        x: 320,
                        y: 168,
                      },
                      {
                        x: 290,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 168,
                      },
                      {
                        x: 320,
                        y: 168,
                      },
                      {
                        x: 320,
                        y: 184,
                      },
                      {
                        x: 290,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 184,
                      },
                      {
                        x: 320,
                        y: 184,
                      },
                      {
                        x: 320,
                        y: 202,
                      },
                      {
                        x: 290,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 202,
                      },
                      {
                        x: 320,
                        y: 202,
                      },
                      {
                        x: 320,
                        y: 220,
                      },
                      {
                        x: 290,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 220,
                      },
                      {
                        x: 320,
                        y: 220,
                      },
                      {
                        x: 320,
                        y: 238,
                      },
                      {
                        x: 290,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 238,
                      },
                      {
                        x: 320,
                        y: 238,
                      },
                      {
                        x: 320,
                        y: 256,
                      },
                      {
                        x: 290,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 256,
                      },
                      {
                        x: 320,
                        y: 256,
                      },
                      {
                        x: 320,
                        y: 274,
                      },
                      {
                        x: 290,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 274,
                      },
                      {
                        x: 320,
                        y: 274,
                      },
                      {
                        x: 320,
                        y: 292,
                      },
                      {
                        x: 290,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 292,
                      },
                      {
                        x: 320,
                        y: 292,
                      },
                      {
                        x: 320,
                        y: 310,
                      },
                      {
                        x: 290,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 310,
                      },
                      {
                        x: 320,
                        y: 310,
                      },
                      {
                        x: 320,
                        y: 328,
                      },
                      {
                        x: 290,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 302,
                            y: 333,
                          },
                          {
                            x: 312,
                            y: 333,
                          },
                          {
                            x: 312,
                            y: 345,
                          },
                          {
                            x: 302,
                            y: 345,
                          },
                        ],
                      },
                      inferConfidence: 0.9998,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 302,
                                y: 333,
                              },
                              {
                                x: 312,
                                y: 333,
                              },
                              {
                                x: 312,
                                y: 345,
                              },
                              {
                                x: 302,
                                y: 345,
                              },
                            ],
                          },
                          inferText: "9",
                          inferConfidence: 0.9998,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 328,
                      },
                      {
                        x: 320,
                        y: 328,
                      },
                      {
                        x: 320,
                        y: 346,
                      },
                      {
                        x: 290,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 0.9998,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 346,
                      },
                      {
                        x: 320,
                        y: 346,
                      },
                      {
                        x: 320,
                        y: 364,
                      },
                      {
                        x: 290,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 364,
                      },
                      {
                        x: 320,
                        y: 364,
                      },
                      {
                        x: 320,
                        y: 382,
                      },
                      {
                        x: 290,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 300,
                            y: 386,
                          },
                          {
                            x: 313,
                            y: 386,
                          },
                          {
                            x: 313,
                            y: 399,
                          },
                          {
                            x: 300,
                            y: 399,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 300,
                                y: 386,
                              },
                              {
                                x: 313,
                                y: 386,
                              },
                              {
                                x: 313,
                                y: 399,
                              },
                              {
                                x: 300,
                                y: 399,
                              },
                            ],
                          },
                          inferText: "6",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 382,
                      },
                      {
                        x: 320,
                        y: 382,
                      },
                      {
                        x: 320,
                        y: 400,
                      },
                      {
                        x: 290,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 302,
                            y: 420,
                          },
                          {
                            x: 310,
                            y: 420,
                          },
                          {
                            x: 310,
                            y: 432,
                          },
                          {
                            x: 302,
                            y: 432,
                          },
                        ],
                      },
                      inferConfidence: 0.9906,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 302,
                                y: 420,
                              },
                              {
                                x: 310,
                                y: 420,
                              },
                              {
                                x: 310,
                                y: 432,
                              },
                              {
                                x: 302,
                                y: 432,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9906,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 416,
                      },
                      {
                        x: 320,
                        y: 416,
                      },
                      {
                        x: 320,
                        y: 434,
                      },
                      {
                        x: 290,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.9906,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 434,
                      },
                      {
                        x: 320,
                        y: 434,
                      },
                      {
                        x: 320,
                        y: 452,
                      },
                      {
                        x: 290,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 452,
                      },
                      {
                        x: 320,
                        y: 452,
                      },
                      {
                        x: 320,
                        y: 470,
                      },
                      {
                        x: 290,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 470,
                      },
                      {
                        x: 320,
                        y: 470,
                      },
                      {
                        x: 320,
                        y: 488,
                      },
                      {
                        x: 290,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 488,
                      },
                      {
                        x: 320,
                        y: 488,
                      },
                      {
                        x: 320,
                        y: 506,
                      },
                      {
                        x: 290,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 506,
                      },
                      {
                        x: 320,
                        y: 506,
                      },
                      {
                        x: 320,
                        y: 524,
                      },
                      {
                        x: 290,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 524,
                      },
                      {
                        x: 320,
                        y: 524,
                      },
                      {
                        x: 320,
                        y: 542,
                      },
                      {
                        x: 290,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 542,
                      },
                      {
                        x: 320,
                        y: 542,
                      },
                      {
                        x: 320,
                        y: 560,
                      },
                      {
                        x: 290,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 560,
                      },
                      {
                        x: 320,
                        y: 560,
                      },
                      {
                        x: 320,
                        y: 578,
                      },
                      {
                        x: 290,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 578,
                      },
                      {
                        x: 320,
                        y: 578,
                      },
                      {
                        x: 320,
                        y: 596,
                      },
                      {
                        x: 290,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 596,
                      },
                      {
                        x: 320,
                        y: 596,
                      },
                      {
                        x: 320,
                        y: 614,
                      },
                      {
                        x: 290,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 614,
                      },
                      {
                        x: 320,
                        y: 614,
                      },
                      {
                        x: 320,
                        y: 630,
                      },
                      {
                        x: 290,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 630,
                      },
                      {
                        x: 320,
                        y: 630,
                      },
                      {
                        x: 320,
                        y: 648,
                      },
                      {
                        x: 290,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 648,
                      },
                      {
                        x: 320,
                        y: 648,
                      },
                      {
                        x: 320,
                        y: 666,
                      },
                      {
                        x: 290,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 666,
                      },
                      {
                        x: 320,
                        y: 666,
                      },
                      {
                        x: 320,
                        y: 684,
                      },
                      {
                        x: 290,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 684,
                      },
                      {
                        x: 320,
                        y: 684,
                      },
                      {
                        x: 320,
                        y: 702,
                      },
                      {
                        x: 290,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 300,
                            y: 707,
                          },
                          {
                            x: 312,
                            y: 707,
                          },
                          {
                            x: 312,
                            y: 721,
                          },
                          {
                            x: 300,
                            y: 721,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 300,
                                y: 707,
                              },
                              {
                                x: 312,
                                y: 707,
                              },
                              {
                                x: 312,
                                y: 721,
                              },
                              {
                                x: 300,
                                y: 721,
                              },
                            ],
                          },
                          inferText: "3",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 702,
                      },
                      {
                        x: 320,
                        y: 702,
                      },
                      {
                        x: 320,
                        y: 720,
                      },
                      {
                        x: 290,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 720,
                      },
                      {
                        x: 320,
                        y: 720,
                      },
                      {
                        x: 320,
                        y: 738,
                      },
                      {
                        x: 290,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 738,
                      },
                      {
                        x: 320,
                        y: 738,
                      },
                      {
                        x: 320,
                        y: 756,
                      },
                      {
                        x: 290,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 290,
                        y: 756,
                      },
                      {
                        x: 320,
                        y: 756,
                      },
                      {
                        x: 320,
                        y: 774,
                      },
                      {
                        x: 290,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 10,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 328,
                            y: 117,
                          },
                          {
                            x: 341,
                            y: 117,
                          },
                          {
                            x: 341,
                            y: 130,
                          },
                          {
                            x: 328,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 328,
                                y: 117,
                              },
                              {
                                x: 341,
                                y: 117,
                              },
                              {
                                x: 341,
                                y: 130,
                              },
                              {
                                x: 328,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 114,
                      },
                      {
                        x: 350,
                        y: 114,
                      },
                      {
                        x: 350,
                        y: 132,
                      },
                      {
                        x: 320,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 132,
                      },
                      {
                        x: 350,
                        y: 132,
                      },
                      {
                        x: 350,
                        y: 150,
                      },
                      {
                        x: 320,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 150,
                      },
                      {
                        x: 350,
                        y: 150,
                      },
                      {
                        x: 350,
                        y: 168,
                      },
                      {
                        x: 320,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 168,
                      },
                      {
                        x: 350,
                        y: 168,
                      },
                      {
                        x: 350,
                        y: 184,
                      },
                      {
                        x: 320,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 184,
                      },
                      {
                        x: 350,
                        y: 184,
                      },
                      {
                        x: 350,
                        y: 202,
                      },
                      {
                        x: 320,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 202,
                      },
                      {
                        x: 350,
                        y: 202,
                      },
                      {
                        x: 350,
                        y: 220,
                      },
                      {
                        x: 320,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 220,
                      },
                      {
                        x: 350,
                        y: 220,
                      },
                      {
                        x: 350,
                        y: 238,
                      },
                      {
                        x: 320,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 238,
                      },
                      {
                        x: 350,
                        y: 238,
                      },
                      {
                        x: 350,
                        y: 256,
                      },
                      {
                        x: 320,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 256,
                      },
                      {
                        x: 350,
                        y: 256,
                      },
                      {
                        x: 350,
                        y: 274,
                      },
                      {
                        x: 320,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 274,
                      },
                      {
                        x: 350,
                        y: 274,
                      },
                      {
                        x: 350,
                        y: 292,
                      },
                      {
                        x: 320,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 292,
                      },
                      {
                        x: 350,
                        y: 292,
                      },
                      {
                        x: 350,
                        y: 310,
                      },
                      {
                        x: 320,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 310,
                      },
                      {
                        x: 350,
                        y: 310,
                      },
                      {
                        x: 350,
                        y: 328,
                      },
                      {
                        x: 320,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 328,
                      },
                      {
                        x: 350,
                        y: 328,
                      },
                      {
                        x: 350,
                        y: 346,
                      },
                      {
                        x: 320,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 346,
                      },
                      {
                        x: 350,
                        y: 346,
                      },
                      {
                        x: 350,
                        y: 364,
                      },
                      {
                        x: 320,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 364,
                      },
                      {
                        x: 350,
                        y: 364,
                      },
                      {
                        x: 350,
                        y: 382,
                      },
                      {
                        x: 320,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 382,
                      },
                      {
                        x: 350,
                        y: 382,
                      },
                      {
                        x: 350,
                        y: 400,
                      },
                      {
                        x: 320,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 332,
                            y: 401,
                          },
                          {
                            x: 369,
                            y: 401,
                          },
                          {
                            x: 369,
                            y: 414,
                          },
                          {
                            x: 332,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 0.9995,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 332,
                                y: 401,
                              },
                              {
                                x: 369,
                                y: 401,
                              },
                              {
                                x: 369,
                                y: 414,
                              },
                              {
                                x: 332,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "GS 4호",
                          inferConfidence: 0.9995,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 400,
                      },
                      {
                        x: 380,
                        y: 400,
                      },
                      {
                        x: 380,
                        y: 416,
                      },
                      {
                        x: 320,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 0.9995,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 4,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 328,
                            y: 420,
                          },
                          {
                            x: 340,
                            y: 420,
                          },
                          {
                            x: 340,
                            y: 433,
                          },
                          {
                            x: 328,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 328,
                                y: 420,
                              },
                              {
                                x: 340,
                                y: 420,
                              },
                              {
                                x: 340,
                                y: 433,
                              },
                              {
                                x: 328,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 416,
                      },
                      {
                        x: 350,
                        y: 416,
                      },
                      {
                        x: 350,
                        y: 434,
                      },
                      {
                        x: 320,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 434,
                      },
                      {
                        x: 350,
                        y: 434,
                      },
                      {
                        x: 350,
                        y: 452,
                      },
                      {
                        x: 320,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 452,
                      },
                      {
                        x: 350,
                        y: 452,
                      },
                      {
                        x: 350,
                        y: 470,
                      },
                      {
                        x: 320,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 470,
                      },
                      {
                        x: 350,
                        y: 470,
                      },
                      {
                        x: 350,
                        y: 488,
                      },
                      {
                        x: 320,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 488,
                      },
                      {
                        x: 350,
                        y: 488,
                      },
                      {
                        x: 350,
                        y: 506,
                      },
                      {
                        x: 320,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 506,
                      },
                      {
                        x: 350,
                        y: 506,
                      },
                      {
                        x: 350,
                        y: 524,
                      },
                      {
                        x: 320,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 524,
                      },
                      {
                        x: 350,
                        y: 524,
                      },
                      {
                        x: 350,
                        y: 542,
                      },
                      {
                        x: 320,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 542,
                      },
                      {
                        x: 350,
                        y: 542,
                      },
                      {
                        x: 350,
                        y: 560,
                      },
                      {
                        x: 320,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 560,
                      },
                      {
                        x: 350,
                        y: 560,
                      },
                      {
                        x: 350,
                        y: 578,
                      },
                      {
                        x: 320,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 578,
                      },
                      {
                        x: 350,
                        y: 578,
                      },
                      {
                        x: 350,
                        y: 596,
                      },
                      {
                        x: 320,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 596,
                      },
                      {
                        x: 350,
                        y: 596,
                      },
                      {
                        x: 350,
                        y: 614,
                      },
                      {
                        x: 320,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 614,
                      },
                      {
                        x: 350,
                        y: 614,
                      },
                      {
                        x: 350,
                        y: 630,
                      },
                      {
                        x: 320,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 630,
                      },
                      {
                        x: 350,
                        y: 630,
                      },
                      {
                        x: 350,
                        y: 648,
                      },
                      {
                        x: 320,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 648,
                      },
                      {
                        x: 350,
                        y: 648,
                      },
                      {
                        x: 350,
                        y: 666,
                      },
                      {
                        x: 320,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 666,
                      },
                      {
                        x: 350,
                        y: 666,
                      },
                      {
                        x: 350,
                        y: 684,
                      },
                      {
                        x: 320,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 684,
                      },
                      {
                        x: 350,
                        y: 684,
                      },
                      {
                        x: 350,
                        y: 702,
                      },
                      {
                        x: 320,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 702,
                      },
                      {
                        x: 350,
                        y: 702,
                      },
                      {
                        x: 350,
                        y: 720,
                      },
                      {
                        x: 320,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 720,
                      },
                      {
                        x: 350,
                        y: 720,
                      },
                      {
                        x: 350,
                        y: 738,
                      },
                      {
                        x: 320,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 738,
                      },
                      {
                        x: 350,
                        y: 738,
                      },
                      {
                        x: 350,
                        y: 756,
                      },
                      {
                        x: 320,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 320,
                        y: 756,
                      },
                      {
                        x: 350,
                        y: 756,
                      },
                      {
                        x: 350,
                        y: 774,
                      },
                      {
                        x: 320,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 2,
                  columnIndex: 11,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 340,
                        y: 78,
                      },
                      {
                        x: 364,
                        y: 78,
                      },
                      {
                        x: 364,
                        y: 114,
                      },
                      {
                        x: 340,
                        y: 114,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 2,
                  rowIndex: 0,
                  columnSpan: 2,
                  columnIndex: 12,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 361,
                            y: 118,
                          },
                          {
                            x: 371,
                            y: 118,
                          },
                          {
                            x: 371,
                            y: 128,
                          },
                          {
                            x: 361,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 0.9958,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 361,
                                y: 118,
                              },
                              {
                                x: 371,
                                y: 118,
                              },
                              {
                                x: 371,
                                y: 128,
                              },
                              {
                                x: 361,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9958,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 114,
                      },
                      {
                        x: 380,
                        y: 114,
                      },
                      {
                        x: 380,
                        y: 132,
                      },
                      {
                        x: 350,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9958,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 132,
                      },
                      {
                        x: 380,
                        y: 132,
                      },
                      {
                        x: 380,
                        y: 150,
                      },
                      {
                        x: 350,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 150,
                      },
                      {
                        x: 380,
                        y: 150,
                      },
                      {
                        x: 380,
                        y: 168,
                      },
                      {
                        x: 350,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 168,
                      },
                      {
                        x: 380,
                        y: 168,
                      },
                      {
                        x: 380,
                        y: 184,
                      },
                      {
                        x: 350,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 184,
                      },
                      {
                        x: 380,
                        y: 184,
                      },
                      {
                        x: 380,
                        y: 202,
                      },
                      {
                        x: 350,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 202,
                      },
                      {
                        x: 380,
                        y: 202,
                      },
                      {
                        x: 380,
                        y: 220,
                      },
                      {
                        x: 350,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 220,
                      },
                      {
                        x: 380,
                        y: 220,
                      },
                      {
                        x: 380,
                        y: 238,
                      },
                      {
                        x: 350,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 238,
                      },
                      {
                        x: 380,
                        y: 238,
                      },
                      {
                        x: 380,
                        y: 256,
                      },
                      {
                        x: 350,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 256,
                      },
                      {
                        x: 380,
                        y: 256,
                      },
                      {
                        x: 380,
                        y: 274,
                      },
                      {
                        x: 350,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 274,
                      },
                      {
                        x: 380,
                        y: 274,
                      },
                      {
                        x: 380,
                        y: 292,
                      },
                      {
                        x: 350,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 292,
                      },
                      {
                        x: 380,
                        y: 292,
                      },
                      {
                        x: 380,
                        y: 310,
                      },
                      {
                        x: 350,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 310,
                      },
                      {
                        x: 380,
                        y: 310,
                      },
                      {
                        x: 380,
                        y: 328,
                      },
                      {
                        x: 350,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 328,
                      },
                      {
                        x: 380,
                        y: 328,
                      },
                      {
                        x: 380,
                        y: 346,
                      },
                      {
                        x: 350,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 346,
                      },
                      {
                        x: 380,
                        y: 346,
                      },
                      {
                        x: 380,
                        y: 364,
                      },
                      {
                        x: 350,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 364,
                      },
                      {
                        x: 380,
                        y: 364,
                      },
                      {
                        x: 380,
                        y: 382,
                      },
                      {
                        x: 350,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 382,
                      },
                      {
                        x: 380,
                        y: 382,
                      },
                      {
                        x: 380,
                        y: 400,
                      },
                      {
                        x: 350,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 361,
                            y: 420,
                          },
                          {
                            x: 371,
                            y: 420,
                          },
                          {
                            x: 371,
                            y: 432,
                          },
                          {
                            x: 361,
                            y: 432,
                          },
                        ],
                      },
                      inferConfidence: 0.9937,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 361,
                                y: 420,
                              },
                              {
                                x: 371,
                                y: 420,
                              },
                              {
                                x: 371,
                                y: 432,
                              },
                              {
                                x: 361,
                                y: 432,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9937,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 416,
                      },
                      {
                        x: 380,
                        y: 416,
                      },
                      {
                        x: 380,
                        y: 434,
                      },
                      {
                        x: 350,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.9937,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 434,
                      },
                      {
                        x: 380,
                        y: 434,
                      },
                      {
                        x: 380,
                        y: 452,
                      },
                      {
                        x: 350,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 452,
                      },
                      {
                        x: 380,
                        y: 452,
                      },
                      {
                        x: 380,
                        y: 470,
                      },
                      {
                        x: 350,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 470,
                      },
                      {
                        x: 380,
                        y: 470,
                      },
                      {
                        x: 380,
                        y: 488,
                      },
                      {
                        x: 350,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 488,
                      },
                      {
                        x: 380,
                        y: 488,
                      },
                      {
                        x: 380,
                        y: 506,
                      },
                      {
                        x: 350,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 506,
                      },
                      {
                        x: 380,
                        y: 506,
                      },
                      {
                        x: 380,
                        y: 524,
                      },
                      {
                        x: 350,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 524,
                      },
                      {
                        x: 380,
                        y: 524,
                      },
                      {
                        x: 380,
                        y: 542,
                      },
                      {
                        x: 350,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 542,
                      },
                      {
                        x: 380,
                        y: 542,
                      },
                      {
                        x: 380,
                        y: 560,
                      },
                      {
                        x: 350,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 560,
                      },
                      {
                        x: 380,
                        y: 560,
                      },
                      {
                        x: 380,
                        y: 578,
                      },
                      {
                        x: 350,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 578,
                      },
                      {
                        x: 380,
                        y: 578,
                      },
                      {
                        x: 380,
                        y: 596,
                      },
                      {
                        x: 350,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 596,
                      },
                      {
                        x: 380,
                        y: 596,
                      },
                      {
                        x: 380,
                        y: 614,
                      },
                      {
                        x: 350,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 614,
                      },
                      {
                        x: 380,
                        y: 614,
                      },
                      {
                        x: 380,
                        y: 630,
                      },
                      {
                        x: 350,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 630,
                      },
                      {
                        x: 380,
                        y: 630,
                      },
                      {
                        x: 380,
                        y: 648,
                      },
                      {
                        x: 350,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 648,
                      },
                      {
                        x: 380,
                        y: 648,
                      },
                      {
                        x: 380,
                        y: 666,
                      },
                      {
                        x: 350,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 666,
                      },
                      {
                        x: 380,
                        y: 666,
                      },
                      {
                        x: 380,
                        y: 684,
                      },
                      {
                        x: 350,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 684,
                      },
                      {
                        x: 380,
                        y: 684,
                      },
                      {
                        x: 380,
                        y: 702,
                      },
                      {
                        x: 350,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 702,
                      },
                      {
                        x: 380,
                        y: 702,
                      },
                      {
                        x: 380,
                        y: 720,
                      },
                      {
                        x: 350,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 720,
                      },
                      {
                        x: 380,
                        y: 720,
                      },
                      {
                        x: 380,
                        y: 738,
                      },
                      {
                        x: 350,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 738,
                      },
                      {
                        x: 380,
                        y: 738,
                      },
                      {
                        x: 380,
                        y: 756,
                      },
                      {
                        x: 350,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 350,
                        y: 756,
                      },
                      {
                        x: 380,
                        y: 756,
                      },
                      {
                        x: 380,
                        y: 774,
                      },
                      {
                        x: 350,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 2,
                  columnIndex: 13,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 364,
                        y: 78,
                      },
                      {
                        x: 410,
                        y: 78,
                      },
                      {
                        x: 410,
                        y: 96,
                      },
                      {
                        x: 364,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 2,
                  columnIndex: 14,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 390,
                            y: 116,
                          },
                          {
                            x: 401,
                            y: 116,
                          },
                          {
                            x: 401,
                            y: 128,
                          },
                          {
                            x: 390,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 390,
                                y: 116,
                              },
                              {
                                x: 401,
                                y: 116,
                              },
                              {
                                x: 401,
                                y: 128,
                              },
                              {
                                x: 390,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 114,
                      },
                      {
                        x: 410,
                        y: 114,
                      },
                      {
                        x: 410,
                        y: 132,
                      },
                      {
                        x: 380,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 132,
                      },
                      {
                        x: 410,
                        y: 132,
                      },
                      {
                        x: 410,
                        y: 150,
                      },
                      {
                        x: 380,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 150,
                      },
                      {
                        x: 410,
                        y: 150,
                      },
                      {
                        x: 410,
                        y: 168,
                      },
                      {
                        x: 380,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 168,
                      },
                      {
                        x: 410,
                        y: 168,
                      },
                      {
                        x: 410,
                        y: 184,
                      },
                      {
                        x: 380,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 184,
                      },
                      {
                        x: 410,
                        y: 184,
                      },
                      {
                        x: 410,
                        y: 202,
                      },
                      {
                        x: 380,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 202,
                      },
                      {
                        x: 410,
                        y: 202,
                      },
                      {
                        x: 410,
                        y: 220,
                      },
                      {
                        x: 380,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 220,
                      },
                      {
                        x: 410,
                        y: 220,
                      },
                      {
                        x: 410,
                        y: 238,
                      },
                      {
                        x: 380,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 238,
                      },
                      {
                        x: 410,
                        y: 238,
                      },
                      {
                        x: 410,
                        y: 256,
                      },
                      {
                        x: 380,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 256,
                      },
                      {
                        x: 410,
                        y: 256,
                      },
                      {
                        x: 410,
                        y: 274,
                      },
                      {
                        x: 380,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 274,
                      },
                      {
                        x: 410,
                        y: 274,
                      },
                      {
                        x: 410,
                        y: 292,
                      },
                      {
                        x: 380,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 292,
                      },
                      {
                        x: 410,
                        y: 292,
                      },
                      {
                        x: 410,
                        y: 310,
                      },
                      {
                        x: 380,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 310,
                      },
                      {
                        x: 410,
                        y: 310,
                      },
                      {
                        x: 410,
                        y: 328,
                      },
                      {
                        x: 380,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 328,
                      },
                      {
                        x: 410,
                        y: 328,
                      },
                      {
                        x: 410,
                        y: 346,
                      },
                      {
                        x: 380,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 346,
                      },
                      {
                        x: 410,
                        y: 346,
                      },
                      {
                        x: 410,
                        y: 364,
                      },
                      {
                        x: 380,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 364,
                      },
                      {
                        x: 410,
                        y: 364,
                      },
                      {
                        x: 410,
                        y: 382,
                      },
                      {
                        x: 380,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 382,
                      },
                      {
                        x: 410,
                        y: 382,
                      },
                      {
                        x: 410,
                        y: 400,
                      },
                      {
                        x: 380,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 389,
                            y: 411,
                          },
                          {
                            x: 401,
                            y: 411,
                          },
                          {
                            x: 401,
                            y: 422,
                          },
                          {
                            x: 389,
                            y: 422,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 389,
                                y: 411,
                              },
                              {
                                x: 401,
                                y: 411,
                              },
                              {
                                x: 401,
                                y: 422,
                              },
                              {
                                x: 389,
                                y: 422,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 400,
                      },
                      {
                        x: 410,
                        y: 400,
                      },
                      {
                        x: 410,
                        y: 434,
                      },
                      {
                        x: 380,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 2,
                  rowIndex: 18,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 434,
                      },
                      {
                        x: 410,
                        y: 434,
                      },
                      {
                        x: 410,
                        y: 452,
                      },
                      {
                        x: 380,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 452,
                      },
                      {
                        x: 410,
                        y: 452,
                      },
                      {
                        x: 410,
                        y: 470,
                      },
                      {
                        x: 380,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 470,
                      },
                      {
                        x: 410,
                        y: 470,
                      },
                      {
                        x: 410,
                        y: 488,
                      },
                      {
                        x: 380,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 488,
                      },
                      {
                        x: 410,
                        y: 488,
                      },
                      {
                        x: 410,
                        y: 506,
                      },
                      {
                        x: 380,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 506,
                      },
                      {
                        x: 410,
                        y: 506,
                      },
                      {
                        x: 410,
                        y: 524,
                      },
                      {
                        x: 380,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 524,
                      },
                      {
                        x: 410,
                        y: 524,
                      },
                      {
                        x: 410,
                        y: 542,
                      },
                      {
                        x: 380,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 542,
                      },
                      {
                        x: 410,
                        y: 542,
                      },
                      {
                        x: 410,
                        y: 560,
                      },
                      {
                        x: 380,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 560,
                      },
                      {
                        x: 410,
                        y: 560,
                      },
                      {
                        x: 410,
                        y: 578,
                      },
                      {
                        x: 380,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 578,
                      },
                      {
                        x: 410,
                        y: 578,
                      },
                      {
                        x: 410,
                        y: 596,
                      },
                      {
                        x: 380,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 596,
                      },
                      {
                        x: 410,
                        y: 596,
                      },
                      {
                        x: 410,
                        y: 614,
                      },
                      {
                        x: 380,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 614,
                      },
                      {
                        x: 410,
                        y: 614,
                      },
                      {
                        x: 410,
                        y: 630,
                      },
                      {
                        x: 380,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 630,
                      },
                      {
                        x: 410,
                        y: 630,
                      },
                      {
                        x: 410,
                        y: 648,
                      },
                      {
                        x: 380,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 648,
                      },
                      {
                        x: 410,
                        y: 648,
                      },
                      {
                        x: 410,
                        y: 666,
                      },
                      {
                        x: 380,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 666,
                      },
                      {
                        x: 410,
                        y: 666,
                      },
                      {
                        x: 410,
                        y: 684,
                      },
                      {
                        x: 380,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 684,
                      },
                      {
                        x: 410,
                        y: 684,
                      },
                      {
                        x: 410,
                        y: 702,
                      },
                      {
                        x: 380,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 702,
                      },
                      {
                        x: 410,
                        y: 702,
                      },
                      {
                        x: 410,
                        y: 720,
                      },
                      {
                        x: 380,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 720,
                      },
                      {
                        x: 410,
                        y: 720,
                      },
                      {
                        x: 410,
                        y: 738,
                      },
                      {
                        x: 380,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 738,
                      },
                      {
                        x: 410,
                        y: 738,
                      },
                      {
                        x: 410,
                        y: 756,
                      },
                      {
                        x: 380,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 380,
                        y: 756,
                      },
                      {
                        x: 410,
                        y: 756,
                      },
                      {
                        x: 410,
                        y: 774,
                      },
                      {
                        x: 380,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 15,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 450,
                            y: 84,
                          },
                          {
                            x: 525,
                            y: 82,
                          },
                          {
                            x: 525,
                            y: 95,
                          },
                          {
                            x: 450,
                            y: 97,
                          },
                        ],
                      },
                      inferConfidence: 0.9954,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 450,
                                y: 84,
                              },
                              {
                                x: 525,
                                y: 82,
                              },
                              {
                                x: 525,
                                y: 95,
                              },
                              {
                                x: 451,
                                y: 96,
                              },
                            ],
                          },
                          inferText: "4×8×12",
                          inferConfidence: 0.9954,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 78,
                      },
                      {
                        x: 560,
                        y: 78,
                      },
                      {
                        x: 560,
                        y: 96,
                      },
                      {
                        x: 410,
                        y: 96,
                      },
                    ],
                  },
                  inferConfidence: 0.9954,
                  rowSpan: 1,
                  rowIndex: 0,
                  columnSpan: 5,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 465,
                            y: 101,
                          },
                          {
                            x: 491,
                            y: 101,
                          },
                          {
                            x: 491,
                            y: 113,
                          },
                          {
                            x: 465,
                            y: 113,
                          },
                        ],
                      },
                      inferConfidence: 0.9583,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 465,
                                y: 101,
                              },
                              {
                                x: 491,
                                y: 101,
                              },
                              {
                                x: 491,
                                y: 113,
                              },
                              {
                                x: 465,
                                y: 113,
                              },
                            ],
                          },
                          inferText: "CP",
                          inferConfidence: 0.9583,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 96,
                      },
                      {
                        x: 560,
                        y: 96,
                      },
                      {
                        x: 560,
                        y: 114,
                      },
                      {
                        x: 410,
                        y: 114,
                      },
                    ],
                  },
                  inferConfidence: 0.9583,
                  rowSpan: 1,
                  rowIndex: 1,
                  columnSpan: 5,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 417,
                            y: 116,
                          },
                          {
                            x: 430,
                            y: 116,
                          },
                          {
                            x: 430,
                            y: 130,
                          },
                          {
                            x: 417,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 417,
                                y: 116,
                              },
                              {
                                x: 430,
                                y: 116,
                              },
                              {
                                x: 430,
                                y: 130,
                              },
                              {
                                x: 417,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 114,
                      },
                      {
                        x: 440,
                        y: 114,
                      },
                      {
                        x: 440,
                        y: 132,
                      },
                      {
                        x: 410,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 132,
                      },
                      {
                        x: 440,
                        y: 132,
                      },
                      {
                        x: 440,
                        y: 150,
                      },
                      {
                        x: 410,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 150,
                      },
                      {
                        x: 440,
                        y: 150,
                      },
                      {
                        x: 440,
                        y: 168,
                      },
                      {
                        x: 410,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 168,
                      },
                      {
                        x: 440,
                        y: 168,
                      },
                      {
                        x: 440,
                        y: 184,
                      },
                      {
                        x: 410,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 184,
                      },
                      {
                        x: 440,
                        y: 184,
                      },
                      {
                        x: 440,
                        y: 202,
                      },
                      {
                        x: 410,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 202,
                      },
                      {
                        x: 440,
                        y: 202,
                      },
                      {
                        x: 440,
                        y: 220,
                      },
                      {
                        x: 410,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 220,
                      },
                      {
                        x: 440,
                        y: 220,
                      },
                      {
                        x: 440,
                        y: 238,
                      },
                      {
                        x: 410,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 238,
                      },
                      {
                        x: 440,
                        y: 238,
                      },
                      {
                        x: 440,
                        y: 256,
                      },
                      {
                        x: 410,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 256,
                      },
                      {
                        x: 440,
                        y: 256,
                      },
                      {
                        x: 440,
                        y: 274,
                      },
                      {
                        x: 410,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 274,
                      },
                      {
                        x: 440,
                        y: 274,
                      },
                      {
                        x: 440,
                        y: 292,
                      },
                      {
                        x: 410,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 292,
                      },
                      {
                        x: 440,
                        y: 292,
                      },
                      {
                        x: 440,
                        y: 310,
                      },
                      {
                        x: 410,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 310,
                      },
                      {
                        x: 440,
                        y: 310,
                      },
                      {
                        x: 440,
                        y: 328,
                      },
                      {
                        x: 410,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 328,
                      },
                      {
                        x: 440,
                        y: 328,
                      },
                      {
                        x: 440,
                        y: 346,
                      },
                      {
                        x: 410,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 346,
                      },
                      {
                        x: 440,
                        y: 346,
                      },
                      {
                        x: 440,
                        y: 364,
                      },
                      {
                        x: 410,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 364,
                      },
                      {
                        x: 440,
                        y: 364,
                      },
                      {
                        x: 440,
                        y: 382,
                      },
                      {
                        x: 410,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 382,
                      },
                      {
                        x: 440,
                        y: 382,
                      },
                      {
                        x: 440,
                        y: 400,
                      },
                      {
                        x: 410,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 421,
                            y: 401,
                          },
                          {
                            x: 458,
                            y: 401,
                          },
                          {
                            x: 458,
                            y: 414,
                          },
                          {
                            x: 421,
                            y: 414,
                          },
                        ],
                      },
                      inferConfidence: 0.9986,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 421,
                                y: 401,
                              },
                              {
                                x: 458,
                                y: 401,
                              },
                              {
                                x: 458,
                                y: 414,
                              },
                              {
                                x: 421,
                                y: 414,
                              },
                            ],
                          },
                          inferText: "GS 3호",
                          inferConfidence: 0.9986,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 400,
                      },
                      {
                        x: 470,
                        y: 400,
                      },
                      {
                        x: 470,
                        y: 416,
                      },
                      {
                        x: 410,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 0.9986,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 2,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 417,
                            y: 420,
                          },
                          {
                            x: 430,
                            y: 420,
                          },
                          {
                            x: 430,
                            y: 433,
                          },
                          {
                            x: 417,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 417,
                                y: 420,
                              },
                              {
                                x: 430,
                                y: 420,
                              },
                              {
                                x: 430,
                                y: 433,
                              },
                              {
                                x: 417,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 416,
                      },
                      {
                        x: 440,
                        y: 416,
                      },
                      {
                        x: 440,
                        y: 434,
                      },
                      {
                        x: 410,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 418,
                            y: 440,
                          },
                          {
                            x: 432,
                            y: 440,
                          },
                          {
                            x: 432,
                            y: 452,
                          },
                          {
                            x: 418,
                            y: 452,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 418,
                                y: 440,
                              },
                              {
                                x: 432,
                                y: 440,
                              },
                              {
                                x: 432,
                                y: 452,
                              },
                              {
                                x: 418,
                                y: 452,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 434,
                      },
                      {
                        x: 440,
                        y: 434,
                      },
                      {
                        x: 440,
                        y: 452,
                      },
                      {
                        x: 410,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 452,
                      },
                      {
                        x: 440,
                        y: 452,
                      },
                      {
                        x: 440,
                        y: 470,
                      },
                      {
                        x: 410,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 470,
                      },
                      {
                        x: 440,
                        y: 470,
                      },
                      {
                        x: 440,
                        y: 488,
                      },
                      {
                        x: 410,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 488,
                      },
                      {
                        x: 440,
                        y: 488,
                      },
                      {
                        x: 440,
                        y: 506,
                      },
                      {
                        x: 410,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 506,
                      },
                      {
                        x: 440,
                        y: 506,
                      },
                      {
                        x: 440,
                        y: 524,
                      },
                      {
                        x: 410,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 524,
                      },
                      {
                        x: 440,
                        y: 524,
                      },
                      {
                        x: 440,
                        y: 542,
                      },
                      {
                        x: 410,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 542,
                      },
                      {
                        x: 440,
                        y: 542,
                      },
                      {
                        x: 440,
                        y: 560,
                      },
                      {
                        x: 410,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 560,
                      },
                      {
                        x: 440,
                        y: 560,
                      },
                      {
                        x: 440,
                        y: 578,
                      },
                      {
                        x: 410,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 578,
                      },
                      {
                        x: 440,
                        y: 578,
                      },
                      {
                        x: 440,
                        y: 596,
                      },
                      {
                        x: 410,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 596,
                      },
                      {
                        x: 440,
                        y: 596,
                      },
                      {
                        x: 440,
                        y: 614,
                      },
                      {
                        x: 410,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 614,
                      },
                      {
                        x: 440,
                        y: 614,
                      },
                      {
                        x: 440,
                        y: 630,
                      },
                      {
                        x: 410,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 630,
                      },
                      {
                        x: 440,
                        y: 630,
                      },
                      {
                        x: 440,
                        y: 648,
                      },
                      {
                        x: 410,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 648,
                      },
                      {
                        x: 440,
                        y: 648,
                      },
                      {
                        x: 440,
                        y: 666,
                      },
                      {
                        x: 410,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 666,
                      },
                      {
                        x: 440,
                        y: 666,
                      },
                      {
                        x: 440,
                        y: 684,
                      },
                      {
                        x: 410,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 684,
                      },
                      {
                        x: 440,
                        y: 684,
                      },
                      {
                        x: 440,
                        y: 702,
                      },
                      {
                        x: 410,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 702,
                      },
                      {
                        x: 440,
                        y: 702,
                      },
                      {
                        x: 440,
                        y: 720,
                      },
                      {
                        x: 410,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 720,
                      },
                      {
                        x: 440,
                        y: 720,
                      },
                      {
                        x: 440,
                        y: 738,
                      },
                      {
                        x: 410,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 738,
                      },
                      {
                        x: 440,
                        y: 738,
                      },
                      {
                        x: 440,
                        y: 756,
                      },
                      {
                        x: 410,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 756,
                      },
                      {
                        x: 440,
                        y: 756,
                      },
                      {
                        x: 440,
                        y: 774,
                      },
                      {
                        x: 410,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 774,
                      },
                      {
                        x: 560,
                        y: 774,
                      },
                      {
                        x: 560,
                        y: 792,
                      },
                      {
                        x: 410,
                        y: 792,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 39,
                  columnSpan: 5,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 467,
                            y: 795,
                          },
                          {
                            x: 493,
                            y: 795,
                          },
                          {
                            x: 493,
                            y: 807,
                          },
                          {
                            x: 467,
                            y: 807,
                          },
                        ],
                      },
                      inferConfidence: 0.8964,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 467,
                                y: 795,
                              },
                              {
                                x: 493,
                                y: 795,
                              },
                              {
                                x: 493,
                                y: 807,
                              },
                              {
                                x: 467,
                                y: 807,
                              },
                            ],
                          },
                          inferText: "956",
                          inferConfidence: 0.8964,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 792,
                      },
                      {
                        x: 498,
                        y: 792,
                      },
                      {
                        x: 498,
                        y: 810,
                      },
                      {
                        x: 410,
                        y: 810,
                      },
                    ],
                  },
                  inferConfidence: 0.8964,
                  rowSpan: 1,
                  rowIndex: 40,
                  columnSpan: 3,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 410,
                        y: 810,
                      },
                      {
                        x: 560,
                        y: 810,
                      },
                      {
                        x: 560,
                        y: 828,
                      },
                      {
                        x: 410,
                        y: 828,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 41,
                  columnSpan: 5,
                  columnIndex: 16,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 450,
                            y: 116,
                          },
                          {
                            x: 462,
                            y: 116,
                          },
                          {
                            x: 462,
                            y: 130,
                          },
                          {
                            x: 450,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 0.9966,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 450,
                                y: 116,
                              },
                              {
                                x: 462,
                                y: 116,
                              },
                              {
                                x: 462,
                                y: 130,
                              },
                              {
                                x: 450,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9966,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 114,
                      },
                      {
                        x: 470,
                        y: 114,
                      },
                      {
                        x: 470,
                        y: 132,
                      },
                      {
                        x: 440,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9966,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 132,
                      },
                      {
                        x: 470,
                        y: 132,
                      },
                      {
                        x: 470,
                        y: 150,
                      },
                      {
                        x: 440,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 150,
                      },
                      {
                        x: 470,
                        y: 150,
                      },
                      {
                        x: 470,
                        y: 168,
                      },
                      {
                        x: 440,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 168,
                      },
                      {
                        x: 470,
                        y: 168,
                      },
                      {
                        x: 470,
                        y: 184,
                      },
                      {
                        x: 440,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 184,
                      },
                      {
                        x: 470,
                        y: 184,
                      },
                      {
                        x: 470,
                        y: 202,
                      },
                      {
                        x: 440,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 202,
                      },
                      {
                        x: 470,
                        y: 202,
                      },
                      {
                        x: 470,
                        y: 220,
                      },
                      {
                        x: 440,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 220,
                      },
                      {
                        x: 470,
                        y: 220,
                      },
                      {
                        x: 470,
                        y: 238,
                      },
                      {
                        x: 440,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 238,
                      },
                      {
                        x: 470,
                        y: 238,
                      },
                      {
                        x: 470,
                        y: 256,
                      },
                      {
                        x: 440,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 256,
                      },
                      {
                        x: 470,
                        y: 256,
                      },
                      {
                        x: 470,
                        y: 274,
                      },
                      {
                        x: 440,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 274,
                      },
                      {
                        x: 470,
                        y: 274,
                      },
                      {
                        x: 470,
                        y: 292,
                      },
                      {
                        x: 440,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 292,
                      },
                      {
                        x: 470,
                        y: 292,
                      },
                      {
                        x: 470,
                        y: 310,
                      },
                      {
                        x: 440,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 310,
                      },
                      {
                        x: 470,
                        y: 310,
                      },
                      {
                        x: 470,
                        y: 328,
                      },
                      {
                        x: 440,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 328,
                      },
                      {
                        x: 470,
                        y: 328,
                      },
                      {
                        x: 470,
                        y: 346,
                      },
                      {
                        x: 440,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 346,
                      },
                      {
                        x: 470,
                        y: 346,
                      },
                      {
                        x: 470,
                        y: 364,
                      },
                      {
                        x: 440,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 364,
                      },
                      {
                        x: 470,
                        y: 364,
                      },
                      {
                        x: 470,
                        y: 382,
                      },
                      {
                        x: 440,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 382,
                      },
                      {
                        x: 470,
                        y: 382,
                      },
                      {
                        x: 470,
                        y: 400,
                      },
                      {
                        x: 440,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 451,
                            y: 420,
                          },
                          {
                            x: 460,
                            y: 420,
                          },
                          {
                            x: 460,
                            y: 433,
                          },
                          {
                            x: 451,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 0.9706,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 451,
                                y: 420,
                              },
                              {
                                x: 460,
                                y: 420,
                              },
                              {
                                x: 460,
                                y: 433,
                              },
                              {
                                x: 451,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9706,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 416,
                      },
                      {
                        x: 470,
                        y: 416,
                      },
                      {
                        x: 470,
                        y: 434,
                      },
                      {
                        x: 440,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.9706,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 434,
                      },
                      {
                        x: 470,
                        y: 434,
                      },
                      {
                        x: 470,
                        y: 452,
                      },
                      {
                        x: 440,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 452,
                      },
                      {
                        x: 470,
                        y: 452,
                      },
                      {
                        x: 470,
                        y: 470,
                      },
                      {
                        x: 440,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 470,
                      },
                      {
                        x: 470,
                        y: 470,
                      },
                      {
                        x: 470,
                        y: 488,
                      },
                      {
                        x: 440,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 488,
                      },
                      {
                        x: 470,
                        y: 488,
                      },
                      {
                        x: 470,
                        y: 506,
                      },
                      {
                        x: 440,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 506,
                      },
                      {
                        x: 470,
                        y: 506,
                      },
                      {
                        x: 470,
                        y: 524,
                      },
                      {
                        x: 440,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 524,
                      },
                      {
                        x: 470,
                        y: 524,
                      },
                      {
                        x: 470,
                        y: 542,
                      },
                      {
                        x: 440,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 542,
                      },
                      {
                        x: 470,
                        y: 542,
                      },
                      {
                        x: 470,
                        y: 560,
                      },
                      {
                        x: 440,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 560,
                      },
                      {
                        x: 470,
                        y: 560,
                      },
                      {
                        x: 470,
                        y: 578,
                      },
                      {
                        x: 440,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 578,
                      },
                      {
                        x: 470,
                        y: 578,
                      },
                      {
                        x: 470,
                        y: 596,
                      },
                      {
                        x: 440,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 596,
                      },
                      {
                        x: 470,
                        y: 596,
                      },
                      {
                        x: 470,
                        y: 614,
                      },
                      {
                        x: 440,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 614,
                      },
                      {
                        x: 470,
                        y: 614,
                      },
                      {
                        x: 470,
                        y: 630,
                      },
                      {
                        x: 440,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 630,
                      },
                      {
                        x: 470,
                        y: 630,
                      },
                      {
                        x: 470,
                        y: 648,
                      },
                      {
                        x: 440,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 648,
                      },
                      {
                        x: 470,
                        y: 648,
                      },
                      {
                        x: 470,
                        y: 666,
                      },
                      {
                        x: 440,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 666,
                      },
                      {
                        x: 470,
                        y: 666,
                      },
                      {
                        x: 470,
                        y: 684,
                      },
                      {
                        x: 440,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 684,
                      },
                      {
                        x: 470,
                        y: 684,
                      },
                      {
                        x: 470,
                        y: 702,
                      },
                      {
                        x: 440,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 702,
                      },
                      {
                        x: 470,
                        y: 702,
                      },
                      {
                        x: 470,
                        y: 720,
                      },
                      {
                        x: 440,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 720,
                      },
                      {
                        x: 470,
                        y: 720,
                      },
                      {
                        x: 470,
                        y: 738,
                      },
                      {
                        x: 440,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 738,
                      },
                      {
                        x: 470,
                        y: 738,
                      },
                      {
                        x: 470,
                        y: 756,
                      },
                      {
                        x: 440,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 440,
                        y: 756,
                      },
                      {
                        x: 470,
                        y: 756,
                      },
                      {
                        x: 470,
                        y: 774,
                      },
                      {
                        x: 440,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 17,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 477,
                            y: 118,
                          },
                          {
                            x: 490,
                            y: 118,
                          },
                          {
                            x: 490,
                            y: 130,
                          },
                          {
                            x: 477,
                            y: 130,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 477,
                                y: 118,
                              },
                              {
                                x: 490,
                                y: 118,
                              },
                              {
                                x: 490,
                                y: 130,
                              },
                              {
                                x: 477,
                                y: 130,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 114,
                      },
                      {
                        x: 498,
                        y: 114,
                      },
                      {
                        x: 498,
                        y: 132,
                      },
                      {
                        x: 470,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 132,
                      },
                      {
                        x: 498,
                        y: 132,
                      },
                      {
                        x: 498,
                        y: 150,
                      },
                      {
                        x: 470,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 150,
                      },
                      {
                        x: 498,
                        y: 150,
                      },
                      {
                        x: 498,
                        y: 168,
                      },
                      {
                        x: 470,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 168,
                      },
                      {
                        x: 498,
                        y: 168,
                      },
                      {
                        x: 498,
                        y: 184,
                      },
                      {
                        x: 470,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 184,
                      },
                      {
                        x: 498,
                        y: 184,
                      },
                      {
                        x: 498,
                        y: 202,
                      },
                      {
                        x: 470,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 202,
                      },
                      {
                        x: 498,
                        y: 202,
                      },
                      {
                        x: 498,
                        y: 220,
                      },
                      {
                        x: 470,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 220,
                      },
                      {
                        x: 498,
                        y: 220,
                      },
                      {
                        x: 498,
                        y: 238,
                      },
                      {
                        x: 470,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 238,
                      },
                      {
                        x: 498,
                        y: 238,
                      },
                      {
                        x: 498,
                        y: 256,
                      },
                      {
                        x: 470,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 256,
                      },
                      {
                        x: 498,
                        y: 256,
                      },
                      {
                        x: 498,
                        y: 274,
                      },
                      {
                        x: 470,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 274,
                      },
                      {
                        x: 498,
                        y: 274,
                      },
                      {
                        x: 498,
                        y: 292,
                      },
                      {
                        x: 470,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 292,
                      },
                      {
                        x: 498,
                        y: 292,
                      },
                      {
                        x: 498,
                        y: 310,
                      },
                      {
                        x: 470,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 310,
                      },
                      {
                        x: 498,
                        y: 310,
                      },
                      {
                        x: 498,
                        y: 328,
                      },
                      {
                        x: 470,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 328,
                      },
                      {
                        x: 498,
                        y: 328,
                      },
                      {
                        x: 498,
                        y: 346,
                      },
                      {
                        x: 470,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 346,
                      },
                      {
                        x: 498,
                        y: 346,
                      },
                      {
                        x: 498,
                        y: 364,
                      },
                      {
                        x: 470,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 364,
                      },
                      {
                        x: 498,
                        y: 364,
                      },
                      {
                        x: 498,
                        y: 382,
                      },
                      {
                        x: 470,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 477,
                            y: 384,
                          },
                          {
                            x: 489,
                            y: 384,
                          },
                          {
                            x: 489,
                            y: 397,
                          },
                          {
                            x: 477,
                            y: 397,
                          },
                        ],
                      },
                      inferConfidence: 0.4737,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 477,
                                y: 384,
                              },
                              {
                                x: 489,
                                y: 384,
                              },
                              {
                                x: 489,
                                y: 397,
                              },
                              {
                                x: 477,
                                y: 397,
                              },
                            ],
                          },
                          inferText: "←",
                          inferConfidence: 0.4737,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 382,
                      },
                      {
                        x: 498,
                        y: 382,
                      },
                      {
                        x: 498,
                        y: 400,
                      },
                      {
                        x: 470,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 0.4737,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 481,
                            y: 402,
                          },
                          {
                            x: 517,
                            y: 402,
                          },
                          {
                            x: 517,
                            y: 413,
                          },
                          {
                            x: 481,
                            y: 413,
                          },
                        ],
                      },
                      inferConfidence: 0.98,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 481,
                                y: 402,
                              },
                              {
                                x: 517,
                                y: 402,
                              },
                              {
                                x: 517,
                                y: 413,
                              },
                              {
                                x: 481,
                                y: 413,
                              },
                            ],
                          },
                          inferText: "GS 4호",
                          inferConfidence: 0.98,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 400,
                      },
                      {
                        x: 528,
                        y: 400,
                      },
                      {
                        x: 528,
                        y: 416,
                      },
                      {
                        x: 470,
                        y: 416,
                      },
                    ],
                  },
                  inferConfidence: 0.98,
                  rowSpan: 1,
                  rowIndex: 18,
                  columnSpan: 2,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 477,
                            y: 420,
                          },
                          {
                            x: 490,
                            y: 420,
                          },
                          {
                            x: 490,
                            y: 433,
                          },
                          {
                            x: 477,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 0.9999,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 477,
                                y: 420,
                              },
                              {
                                x: 490,
                                y: 420,
                              },
                              {
                                x: 490,
                                y: 433,
                              },
                              {
                                x: 477,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "A",
                          inferConfidence: 0.9999,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 416,
                      },
                      {
                        x: 498,
                        y: 416,
                      },
                      {
                        x: 498,
                        y: 434,
                      },
                      {
                        x: 470,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.9999,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 475,
                            y: 439,
                          },
                          {
                            x: 490,
                            y: 439,
                          },
                          {
                            x: 490,
                            y: 452,
                          },
                          {
                            x: 475,
                            y: 452,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 475,
                                y: 439,
                              },
                              {
                                x: 490,
                                y: 439,
                              },
                              {
                                x: 490,
                                y: 452,
                              },
                              {
                                x: 475,
                                y: 452,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 434,
                      },
                      {
                        x: 498,
                        y: 434,
                      },
                      {
                        x: 498,
                        y: 452,
                      },
                      {
                        x: 470,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 452,
                      },
                      {
                        x: 498,
                        y: 452,
                      },
                      {
                        x: 498,
                        y: 470,
                      },
                      {
                        x: 470,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 470,
                      },
                      {
                        x: 498,
                        y: 470,
                      },
                      {
                        x: 498,
                        y: 488,
                      },
                      {
                        x: 470,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 488,
                      },
                      {
                        x: 498,
                        y: 488,
                      },
                      {
                        x: 498,
                        y: 506,
                      },
                      {
                        x: 470,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 506,
                      },
                      {
                        x: 498,
                        y: 506,
                      },
                      {
                        x: 498,
                        y: 524,
                      },
                      {
                        x: 470,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 524,
                      },
                      {
                        x: 498,
                        y: 524,
                      },
                      {
                        x: 498,
                        y: 542,
                      },
                      {
                        x: 470,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 542,
                      },
                      {
                        x: 498,
                        y: 542,
                      },
                      {
                        x: 498,
                        y: 560,
                      },
                      {
                        x: 470,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 560,
                      },
                      {
                        x: 498,
                        y: 560,
                      },
                      {
                        x: 498,
                        y: 578,
                      },
                      {
                        x: 470,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 578,
                      },
                      {
                        x: 498,
                        y: 578,
                      },
                      {
                        x: 498,
                        y: 596,
                      },
                      {
                        x: 470,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 596,
                      },
                      {
                        x: 498,
                        y: 596,
                      },
                      {
                        x: 498,
                        y: 614,
                      },
                      {
                        x: 470,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 614,
                      },
                      {
                        x: 498,
                        y: 614,
                      },
                      {
                        x: 498,
                        y: 630,
                      },
                      {
                        x: 470,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 630,
                      },
                      {
                        x: 498,
                        y: 630,
                      },
                      {
                        x: 498,
                        y: 648,
                      },
                      {
                        x: 470,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 648,
                      },
                      {
                        x: 498,
                        y: 648,
                      },
                      {
                        x: 498,
                        y: 666,
                      },
                      {
                        x: 470,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 666,
                      },
                      {
                        x: 498,
                        y: 666,
                      },
                      {
                        x: 498,
                        y: 684,
                      },
                      {
                        x: 470,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 684,
                      },
                      {
                        x: 498,
                        y: 684,
                      },
                      {
                        x: 498,
                        y: 702,
                      },
                      {
                        x: 470,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 702,
                      },
                      {
                        x: 498,
                        y: 702,
                      },
                      {
                        x: 498,
                        y: 720,
                      },
                      {
                        x: 470,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 720,
                      },
                      {
                        x: 498,
                        y: 720,
                      },
                      {
                        x: 498,
                        y: 738,
                      },
                      {
                        x: 470,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 738,
                      },
                      {
                        x: 498,
                        y: 738,
                      },
                      {
                        x: 498,
                        y: 756,
                      },
                      {
                        x: 470,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 470,
                        y: 756,
                      },
                      {
                        x: 498,
                        y: 756,
                      },
                      {
                        x: 498,
                        y: 774,
                      },
                      {
                        x: 470,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 18,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 509,
                            y: 117,
                          },
                          {
                            x: 520,
                            y: 117,
                          },
                          {
                            x: 520,
                            y: 129,
                          },
                          {
                            x: 509,
                            y: 129,
                          },
                        ],
                      },
                      inferConfidence: 0.9996,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 509,
                                y: 117,
                              },
                              {
                                x: 520,
                                y: 117,
                              },
                              {
                                x: 520,
                                y: 129,
                              },
                              {
                                x: 509,
                                y: 129,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.9996,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 114,
                      },
                      {
                        x: 528,
                        y: 114,
                      },
                      {
                        x: 528,
                        y: 132,
                      },
                      {
                        x: 498,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 0.9996,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 132,
                      },
                      {
                        x: 528,
                        y: 132,
                      },
                      {
                        x: 528,
                        y: 150,
                      },
                      {
                        x: 498,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 150,
                      },
                      {
                        x: 528,
                        y: 150,
                      },
                      {
                        x: 528,
                        y: 168,
                      },
                      {
                        x: 498,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 168,
                      },
                      {
                        x: 528,
                        y: 168,
                      },
                      {
                        x: 528,
                        y: 184,
                      },
                      {
                        x: 498,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 184,
                      },
                      {
                        x: 528,
                        y: 184,
                      },
                      {
                        x: 528,
                        y: 202,
                      },
                      {
                        x: 498,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 202,
                      },
                      {
                        x: 528,
                        y: 202,
                      },
                      {
                        x: 528,
                        y: 220,
                      },
                      {
                        x: 498,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 220,
                      },
                      {
                        x: 528,
                        y: 220,
                      },
                      {
                        x: 528,
                        y: 238,
                      },
                      {
                        x: 498,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 238,
                      },
                      {
                        x: 528,
                        y: 238,
                      },
                      {
                        x: 528,
                        y: 256,
                      },
                      {
                        x: 498,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 256,
                      },
                      {
                        x: 528,
                        y: 256,
                      },
                      {
                        x: 528,
                        y: 274,
                      },
                      {
                        x: 498,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 274,
                      },
                      {
                        x: 528,
                        y: 274,
                      },
                      {
                        x: 528,
                        y: 292,
                      },
                      {
                        x: 498,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 292,
                      },
                      {
                        x: 528,
                        y: 292,
                      },
                      {
                        x: 528,
                        y: 310,
                      },
                      {
                        x: 498,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 310,
                      },
                      {
                        x: 528,
                        y: 310,
                      },
                      {
                        x: 528,
                        y: 328,
                      },
                      {
                        x: 498,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 328,
                      },
                      {
                        x: 528,
                        y: 328,
                      },
                      {
                        x: 528,
                        y: 346,
                      },
                      {
                        x: 498,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 346,
                      },
                      {
                        x: 528,
                        y: 346,
                      },
                      {
                        x: 528,
                        y: 364,
                      },
                      {
                        x: 498,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 364,
                      },
                      {
                        x: 528,
                        y: 364,
                      },
                      {
                        x: 528,
                        y: 382,
                      },
                      {
                        x: 498,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 508,
                            y: 387,
                          },
                          {
                            x: 524,
                            y: 387,
                          },
                          {
                            x: 524,
                            y: 397,
                          },
                          {
                            x: 508,
                            y: 397,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 508,
                                y: 387,
                              },
                              {
                                x: 524,
                                y: 387,
                              },
                              {
                                x: 524,
                                y: 397,
                              },
                              {
                                x: 508,
                                y: 397,
                              },
                            ],
                          },
                          inferText: "31",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 382,
                      },
                      {
                        x: 528,
                        y: 382,
                      },
                      {
                        x: 528,
                        y: 400,
                      },
                      {
                        x: 498,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 510,
                            y: 420,
                          },
                          {
                            x: 520,
                            y: 420,
                          },
                          {
                            x: 520,
                            y: 433,
                          },
                          {
                            x: 510,
                            y: 433,
                          },
                        ],
                      },
                      inferConfidence: 0.8952,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 510,
                                y: 420,
                              },
                              {
                                x: 520,
                                y: 420,
                              },
                              {
                                x: 520,
                                y: 433,
                              },
                              {
                                x: 510,
                                y: 433,
                              },
                            ],
                          },
                          inferText: "B",
                          inferConfidence: 0.8952,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 416,
                      },
                      {
                        x: 528,
                        y: 416,
                      },
                      {
                        x: 528,
                        y: 434,
                      },
                      {
                        x: 498,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 0.8952,
                  rowSpan: 1,
                  rowIndex: 19,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 434,
                      },
                      {
                        x: 528,
                        y: 434,
                      },
                      {
                        x: 528,
                        y: 452,
                      },
                      {
                        x: 498,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 507,
                            y: 457,
                          },
                          {
                            x: 521,
                            y: 457,
                          },
                          {
                            x: 521,
                            y: 469,
                          },
                          {
                            x: 507,
                            y: 469,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 507,
                                y: 457,
                              },
                              {
                                x: 521,
                                y: 457,
                              },
                              {
                                x: 521,
                                y: 469,
                              },
                              {
                                x: 507,
                                y: 469,
                              },
                            ],
                          },
                          inferText: "2",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 452,
                      },
                      {
                        x: 528,
                        y: 452,
                      },
                      {
                        x: 528,
                        y: 470,
                      },
                      {
                        x: 498,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 470,
                      },
                      {
                        x: 528,
                        y: 470,
                      },
                      {
                        x: 528,
                        y: 488,
                      },
                      {
                        x: 498,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 488,
                      },
                      {
                        x: 528,
                        y: 488,
                      },
                      {
                        x: 528,
                        y: 506,
                      },
                      {
                        x: 498,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 506,
                      },
                      {
                        x: 528,
                        y: 506,
                      },
                      {
                        x: 528,
                        y: 524,
                      },
                      {
                        x: 498,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 524,
                      },
                      {
                        x: 528,
                        y: 524,
                      },
                      {
                        x: 528,
                        y: 542,
                      },
                      {
                        x: 498,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 542,
                      },
                      {
                        x: 528,
                        y: 542,
                      },
                      {
                        x: 528,
                        y: 560,
                      },
                      {
                        x: 498,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 560,
                      },
                      {
                        x: 528,
                        y: 560,
                      },
                      {
                        x: 528,
                        y: 578,
                      },
                      {
                        x: 498,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 578,
                      },
                      {
                        x: 528,
                        y: 578,
                      },
                      {
                        x: 528,
                        y: 596,
                      },
                      {
                        x: 498,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 596,
                      },
                      {
                        x: 528,
                        y: 596,
                      },
                      {
                        x: 528,
                        y: 614,
                      },
                      {
                        x: 498,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 614,
                      },
                      {
                        x: 528,
                        y: 614,
                      },
                      {
                        x: 528,
                        y: 630,
                      },
                      {
                        x: 498,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 630,
                      },
                      {
                        x: 528,
                        y: 630,
                      },
                      {
                        x: 528,
                        y: 648,
                      },
                      {
                        x: 498,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 648,
                      },
                      {
                        x: 528,
                        y: 648,
                      },
                      {
                        x: 528,
                        y: 666,
                      },
                      {
                        x: 498,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 666,
                      },
                      {
                        x: 528,
                        y: 666,
                      },
                      {
                        x: 528,
                        y: 684,
                      },
                      {
                        x: 498,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 684,
                      },
                      {
                        x: 528,
                        y: 684,
                      },
                      {
                        x: 528,
                        y: 702,
                      },
                      {
                        x: 498,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 702,
                      },
                      {
                        x: 528,
                        y: 702,
                      },
                      {
                        x: 528,
                        y: 720,
                      },
                      {
                        x: 498,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 720,
                      },
                      {
                        x: 528,
                        y: 720,
                      },
                      {
                        x: 528,
                        y: 738,
                      },
                      {
                        x: 498,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 738,
                      },
                      {
                        x: 528,
                        y: 738,
                      },
                      {
                        x: 528,
                        y: 756,
                      },
                      {
                        x: 498,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 756,
                      },
                      {
                        x: 528,
                        y: 756,
                      },
                      {
                        x: 528,
                        y: 774,
                      },
                      {
                        x: 498,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 498,
                        y: 792,
                      },
                      {
                        x: 560,
                        y: 792,
                      },
                      {
                        x: 560,
                        y: 810,
                      },
                      {
                        x: 498,
                        y: 810,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 40,
                  columnSpan: 2,
                  columnIndex: 19,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 538,
                            y: 117,
                          },
                          {
                            x: 550,
                            y: 117,
                          },
                          {
                            x: 550,
                            y: 128,
                          },
                          {
                            x: 538,
                            y: 128,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 538,
                                y: 117,
                              },
                              {
                                x: 550,
                                y: 117,
                              },
                              {
                                x: 550,
                                y: 128,
                              },
                              {
                                x: 538,
                                y: 128,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 114,
                      },
                      {
                        x: 560,
                        y: 114,
                      },
                      {
                        x: 560,
                        y: 132,
                      },
                      {
                        x: 528,
                        y: 132,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 2,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 132,
                      },
                      {
                        x: 560,
                        y: 132,
                      },
                      {
                        x: 560,
                        y: 150,
                      },
                      {
                        x: 528,
                        y: 150,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 3,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 150,
                      },
                      {
                        x: 560,
                        y: 150,
                      },
                      {
                        x: 560,
                        y: 168,
                      },
                      {
                        x: 528,
                        y: 168,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 4,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 168,
                      },
                      {
                        x: 560,
                        y: 168,
                      },
                      {
                        x: 560,
                        y: 184,
                      },
                      {
                        x: 528,
                        y: 184,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 5,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 184,
                      },
                      {
                        x: 560,
                        y: 184,
                      },
                      {
                        x: 560,
                        y: 202,
                      },
                      {
                        x: 528,
                        y: 202,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 6,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 202,
                      },
                      {
                        x: 560,
                        y: 202,
                      },
                      {
                        x: 560,
                        y: 220,
                      },
                      {
                        x: 528,
                        y: 220,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 7,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 220,
                      },
                      {
                        x: 560,
                        y: 220,
                      },
                      {
                        x: 560,
                        y: 238,
                      },
                      {
                        x: 528,
                        y: 238,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 8,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 238,
                      },
                      {
                        x: 560,
                        y: 238,
                      },
                      {
                        x: 560,
                        y: 256,
                      },
                      {
                        x: 528,
                        y: 256,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 9,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 256,
                      },
                      {
                        x: 560,
                        y: 256,
                      },
                      {
                        x: 560,
                        y: 274,
                      },
                      {
                        x: 528,
                        y: 274,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 10,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 274,
                      },
                      {
                        x: 560,
                        y: 274,
                      },
                      {
                        x: 560,
                        y: 292,
                      },
                      {
                        x: 528,
                        y: 292,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 11,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 292,
                      },
                      {
                        x: 560,
                        y: 292,
                      },
                      {
                        x: 560,
                        y: 310,
                      },
                      {
                        x: 528,
                        y: 310,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 12,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 310,
                      },
                      {
                        x: 560,
                        y: 310,
                      },
                      {
                        x: 560,
                        y: 328,
                      },
                      {
                        x: 528,
                        y: 328,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 13,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 328,
                      },
                      {
                        x: 560,
                        y: 328,
                      },
                      {
                        x: 560,
                        y: 346,
                      },
                      {
                        x: 528,
                        y: 346,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 14,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 346,
                      },
                      {
                        x: 560,
                        y: 346,
                      },
                      {
                        x: 560,
                        y: 364,
                      },
                      {
                        x: 528,
                        y: 364,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 15,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 364,
                      },
                      {
                        x: 560,
                        y: 364,
                      },
                      {
                        x: 560,
                        y: 382,
                      },
                      {
                        x: 528,
                        y: 382,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 16,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 382,
                      },
                      {
                        x: 560,
                        y: 382,
                      },
                      {
                        x: 560,
                        y: 400,
                      },
                      {
                        x: 528,
                        y: 400,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 17,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [
                    {
                      boundingPoly: {
                        vertices: [
                          {
                            x: 537,
                            y: 409,
                          },
                          {
                            x: 550,
                            y: 409,
                          },
                          {
                            x: 550,
                            y: 424,
                          },
                          {
                            x: 537,
                            y: 424,
                          },
                        ],
                      },
                      inferConfidence: 1,
                      cellWords: [
                        {
                          boundingPoly: {
                            vertices: [
                              {
                                x: 537,
                                y: 409,
                              },
                              {
                                x: 550,
                                y: 409,
                              },
                              {
                                x: 550,
                                y: 424,
                              },
                              {
                                x: 537,
                                y: 424,
                              },
                            ],
                          },
                          inferText: "계",
                          inferConfidence: 1,
                        },
                      ],
                    },
                  ],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 400,
                      },
                      {
                        x: 560,
                        y: 400,
                      },
                      {
                        x: 560,
                        y: 434,
                      },
                      {
                        x: 528,
                        y: 434,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 2,
                  rowIndex: 18,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 434,
                      },
                      {
                        x: 560,
                        y: 434,
                      },
                      {
                        x: 560,
                        y: 452,
                      },
                      {
                        x: 528,
                        y: 452,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 20,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 452,
                      },
                      {
                        x: 560,
                        y: 452,
                      },
                      {
                        x: 560,
                        y: 470,
                      },
                      {
                        x: 528,
                        y: 470,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 21,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 470,
                      },
                      {
                        x: 560,
                        y: 470,
                      },
                      {
                        x: 560,
                        y: 488,
                      },
                      {
                        x: 528,
                        y: 488,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 22,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 488,
                      },
                      {
                        x: 560,
                        y: 488,
                      },
                      {
                        x: 560,
                        y: 506,
                      },
                      {
                        x: 528,
                        y: 506,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 23,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 506,
                      },
                      {
                        x: 560,
                        y: 506,
                      },
                      {
                        x: 560,
                        y: 524,
                      },
                      {
                        x: 528,
                        y: 524,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 24,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 524,
                      },
                      {
                        x: 560,
                        y: 524,
                      },
                      {
                        x: 560,
                        y: 542,
                      },
                      {
                        x: 528,
                        y: 542,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 25,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 542,
                      },
                      {
                        x: 560,
                        y: 542,
                      },
                      {
                        x: 560,
                        y: 560,
                      },
                      {
                        x: 528,
                        y: 560,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 26,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 560,
                      },
                      {
                        x: 560,
                        y: 560,
                      },
                      {
                        x: 560,
                        y: 578,
                      },
                      {
                        x: 528,
                        y: 578,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 27,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 578,
                      },
                      {
                        x: 560,
                        y: 578,
                      },
                      {
                        x: 560,
                        y: 596,
                      },
                      {
                        x: 528,
                        y: 596,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 28,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 596,
                      },
                      {
                        x: 560,
                        y: 596,
                      },
                      {
                        x: 560,
                        y: 614,
                      },
                      {
                        x: 528,
                        y: 614,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 29,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 614,
                      },
                      {
                        x: 560,
                        y: 614,
                      },
                      {
                        x: 560,
                        y: 630,
                      },
                      {
                        x: 528,
                        y: 630,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 30,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 630,
                      },
                      {
                        x: 560,
                        y: 630,
                      },
                      {
                        x: 560,
                        y: 648,
                      },
                      {
                        x: 528,
                        y: 648,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 31,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 648,
                      },
                      {
                        x: 560,
                        y: 648,
                      },
                      {
                        x: 560,
                        y: 666,
                      },
                      {
                        x: 528,
                        y: 666,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 32,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 666,
                      },
                      {
                        x: 560,
                        y: 666,
                      },
                      {
                        x: 560,
                        y: 684,
                      },
                      {
                        x: 528,
                        y: 684,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 33,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 684,
                      },
                      {
                        x: 560,
                        y: 684,
                      },
                      {
                        x: 560,
                        y: 702,
                      },
                      {
                        x: 528,
                        y: 702,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 34,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 702,
                      },
                      {
                        x: 560,
                        y: 702,
                      },
                      {
                        x: 560,
                        y: 720,
                      },
                      {
                        x: 528,
                        y: 720,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 35,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 720,
                      },
                      {
                        x: 560,
                        y: 720,
                      },
                      {
                        x: 560,
                        y: 738,
                      },
                      {
                        x: 528,
                        y: 738,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 36,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 738,
                      },
                      {
                        x: 560,
                        y: 738,
                      },
                      {
                        x: 560,
                        y: 756,
                      },
                      {
                        x: 528,
                        y: 756,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 37,
                  columnSpan: 1,
                  columnIndex: 20,
                },
                {
                  cellTextLines: [],
                  boundingPoly: {
                    vertices: [
                      {
                        x: 528,
                        y: 756,
                      },
                      {
                        x: 560,
                        y: 756,
                      },
                      {
                        x: 560,
                        y: 774,
                      },
                      {
                        x: 528,
                        y: 774,
                      },
                    ],
                  },
                  inferConfidence: 1,
                  rowSpan: 1,
                  rowIndex: 38,
                  columnSpan: 1,
                  columnIndex: 20,
                },
              ],
              boundingPoly: {
                vertices: [
                  {
                    x: 16,
                    y: 74,
                  },
                  {
                    x: 564,
                    y: 74,
                  },
                  {
                    x: 564,
                    y: 832,
                  },
                  {
                    x: 16,
                    y: 832,
                  },
                ],
              },
              inferConfidence: 0.9959256,
            },
          ],
          fields: [
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 209,
                    y: 17,
                  },
                  {
                    x: 373,
                    y: 17,
                  },
                  {
                    x: 373,
                    y: 45,
                  },
                  {
                    x: 209,
                    y: 45,
                  },
                ],
              },
              inferText: "공정별 불량현황",
              inferConfidence: 0.998,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 381,
                    y: 65,
                  },
                  {
                    x: 418,
                    y: 65,
                  },
                  {
                    x: 418,
                    y: 76,
                  },
                  {
                    x: 381,
                    y: 76,
                  },
                ],
              },
              inferText: "2023",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 427,
                    y: 64,
                  },
                  {
                    x: 439,
                    y: 64,
                  },
                  {
                    x: 439,
                    y: 76,
                  },
                  {
                    x: 427,
                    y: 76,
                  },
                ],
              },
              inferText: "년",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 454,
                    y: 65,
                  },
                  {
                    x: 469,
                    y: 65,
                  },
                  {
                    x: 469,
                    y: 77,
                  },
                  {
                    x: 454,
                    y: 77,
                  },
                ],
              },
              inferText: "3",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 485,
                    y: 64,
                  },
                  {
                    x: 499,
                    y: 64,
                  },
                  {
                    x: 499,
                    y: 75,
                  },
                  {
                    x: 485,
                    y: 75,
                  },
                ],
              },
              inferText: "월",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 507,
                    y: 62,
                  },
                  {
                    x: 521,
                    y: 62,
                  },
                  {
                    x: 521,
                    y: 77,
                  },
                  {
                    x: 507,
                    y: 77,
                  },
                ],
              },
              inferText: "9",
              inferConfidence: 0.9987,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 547,
                    y: 65,
                  },
                  {
                    x: 558,
                    y: 65,
                  },
                  {
                    x: 558,
                    y: 77,
                  },
                  {
                    x: 547,
                    y: 77,
                  },
                ],
              },
              inferText: "일",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 146,
                    y: 81,
                  },
                  {
                    x: 238,
                    y: 81,
                  },
                  {
                    x: 238,
                    y: 95,
                  },
                  {
                    x: 146,
                    y: 95,
                  },
                ],
              },
              inferText: "3×6×18",
              inferConfidence: 0.9831,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 294,
                    y: 81,
                  },
                  {
                    x: 381,
                    y: 81,
                  },
                  {
                    x: 381,
                    y: 95,
                  },
                  {
                    x: 294,
                    y: 95,
                  },
                ],
              },
              inferText: "3×6×12",
              inferConfidence: 0.9914,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 450,
                    y: 84,
                  },
                  {
                    x: 525,
                    y: 82,
                  },
                  {
                    x: 525,
                    y: 95,
                  },
                  {
                    x: 451,
                    y: 96,
                  },
                ],
              },
              inferText: "4×8×12",
              inferConfidence: 0.9954,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 25,
                    y: 98,
                  },
                  {
                    x: 49,
                    y: 98,
                  },
                  {
                    x: 49,
                    y: 112,
                  },
                  {
                    x: 25,
                    y: 112,
                  },
                ],
              },
              inferText: "공정",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 60,
                    y: 98,
                  },
                  {
                    x: 105,
                    y: 98,
                  },
                  {
                    x: 105,
                    y: 111,
                  },
                  {
                    x: 60,
                    y: 111,
                  },
                ],
              },
              inferText: "불량내역",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 165,
                    y: 98,
                  },
                  {
                    x: 218,
                    y: 98,
                  },
                  {
                    x: 218,
                    y: 114,
                  },
                  {
                    x: 165,
                    y: 114,
                  },
                ],
              },
              inferText: "조선개",
              inferConfidence: 0.7822,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 307,
                    y: 101,
                  },
                  {
                    x: 327,
                    y: 101,
                  },
                  {
                    x: 327,
                    y: 114,
                  },
                  {
                    x: 307,
                    y: 114,
                  },
                ],
              },
              inferText: "CP",
              inferConfidence: 0.8191,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 343,
                    y: 100,
                  },
                  {
                    x: 388,
                    y: 100,
                  },
                  {
                    x: 388,
                    y: 112,
                  },
                  {
                    x: 343,
                    y: 112,
                  },
                ],
              },
              inferText: "(테크)",
              inferConfidence: 0.9904,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 465,
                    y: 101,
                  },
                  {
                    x: 491,
                    y: 101,
                  },
                  {
                    x: 491,
                    y: 113,
                  },
                  {
                    x: 465,
                    y: 113,
                  },
                ],
              },
              inferText: "CP",
              inferConfidence: 0.9583,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 121,
                    y: 117,
                  },
                  {
                    x: 132,
                    y: 117,
                  },
                  {
                    x: 132,
                    y: 128,
                  },
                  {
                    x: 121,
                    y: 128,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 152,
                    y: 116,
                  },
                  {
                    x: 164,
                    y: 116,
                  },
                  {
                    x: 164,
                    y: 130,
                  },
                  {
                    x: 152,
                    y: 130,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9869,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 180,
                    y: 117,
                  },
                  {
                    x: 191,
                    y: 117,
                  },
                  {
                    x: 191,
                    y: 128,
                  },
                  {
                    x: 180,
                    y: 128,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 213,
                    y: 117,
                  },
                  {
                    x: 223,
                    y: 117,
                  },
                  {
                    x: 223,
                    y: 128,
                  },
                  {
                    x: 213,
                    y: 128,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9981,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 240,
                    y: 116,
                  },
                  {
                    x: 253,
                    y: 116,
                  },
                  {
                    x: 253,
                    y: 128,
                  },
                  {
                    x: 240,
                    y: 128,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 0.8597,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 268,
                    y: 116,
                  },
                  {
                    x: 282,
                    y: 116,
                  },
                  {
                    x: 282,
                    y: 130,
                  },
                  {
                    x: 268,
                    y: 130,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 303,
                    y: 117,
                  },
                  {
                    x: 312,
                    y: 117,
                  },
                  {
                    x: 312,
                    y: 129,
                  },
                  {
                    x: 303,
                    y: 129,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.985,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 328,
                    y: 117,
                  },
                  {
                    x: 341,
                    y: 117,
                  },
                  {
                    x: 341,
                    y: 130,
                  },
                  {
                    x: 328,
                    y: 130,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 361,
                    y: 118,
                  },
                  {
                    x: 371,
                    y: 118,
                  },
                  {
                    x: 371,
                    y: 128,
                  },
                  {
                    x: 361,
                    y: 128,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9958,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 390,
                    y: 116,
                  },
                  {
                    x: 401,
                    y: 116,
                  },
                  {
                    x: 401,
                    y: 128,
                  },
                  {
                    x: 390,
                    y: 128,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 417,
                    y: 116,
                  },
                  {
                    x: 430,
                    y: 116,
                  },
                  {
                    x: 430,
                    y: 130,
                  },
                  {
                    x: 417,
                    y: 130,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 450,
                    y: 116,
                  },
                  {
                    x: 462,
                    y: 116,
                  },
                  {
                    x: 462,
                    y: 130,
                  },
                  {
                    x: 450,
                    y: 130,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9966,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 477,
                    y: 118,
                  },
                  {
                    x: 490,
                    y: 118,
                  },
                  {
                    x: 490,
                    y: 130,
                  },
                  {
                    x: 477,
                    y: 130,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 509,
                    y: 117,
                  },
                  {
                    x: 520,
                    y: 117,
                  },
                  {
                    x: 520,
                    y: 129,
                  },
                  {
                    x: 509,
                    y: 129,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9996,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 538,
                    y: 117,
                  },
                  {
                    x: 550,
                    y: 117,
                  },
                  {
                    x: 550,
                    y: 128,
                  },
                  {
                    x: 538,
                    y: 128,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 133,
                  },
                  {
                    x: 105,
                    y: 133,
                  },
                  {
                    x: 105,
                    y: 147,
                  },
                  {
                    x: 59,
                    y: 147,
                  },
                ],
              },
              inferText: "거친절삭",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 65,
                    y: 152,
                  },
                  {
                    x: 100,
                    y: 152,
                  },
                  {
                    x: 100,
                    y: 165,
                  },
                  {
                    x: 65,
                    y: 165,
                  },
                ],
              },
              inferText: "칼자욱",
              inferConfidence: 0.9364,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 169,
                  },
                  {
                    x: 105,
                    y: 169,
                  },
                  {
                    x: 105,
                    y: 183,
                  },
                  {
                    x: 59,
                    y: 183,
                  },
                ],
              },
              inferText: "중판후박",
              inferConfidence: 0.993,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 24,
                    y: 185,
                  },
                  {
                    x: 49,
                    y: 185,
                  },
                  {
                    x: 49,
                    y: 200,
                  },
                  {
                    x: 24,
                    y: 200,
                  },
                ],
              },
              inferText: "절삭",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 187,
                  },
                  {
                    x: 105,
                    y: 187,
                  },
                  {
                    x: 105,
                    y: 201,
                  },
                  {
                    x: 59,
                    y: 201,
                  },
                ],
              },
              inferText: "파상단판",
              inferConfidence: 0.9986,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 205,
                  },
                  {
                    x: 105,
                    y: 205,
                  },
                  {
                    x: 105,
                    y: 219,
                  },
                  {
                    x: 59,
                    y: 219,
                  },
                ],
              },
              inferText: "파상중판",
              inferConfidence: 0.999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 222,
                  },
                  {
                    x: 105,
                    y: 222,
                  },
                  {
                    x: 105,
                    y: 237,
                  },
                  {
                    x: 59,
                    y: 237,
                  },
                ],
              },
              inferText: "파상병판",
              inferConfidence: 0.9981,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 69,
                    y: 241,
                  },
                  {
                    x: 94,
                    y: 241,
                  },
                  {
                    x: 94,
                    y: 253,
                  },
                  {
                    x: 69,
                    y: 253,
                  },
                ],
              },
              inferText: "오염",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 258,
                  },
                  {
                    x: 104,
                    y: 258,
                  },
                  {
                    x: 104,
                    y: 273,
                  },
                  {
                    x: 59,
                    y: 273,
                  },
                ],
              },
              inferText: "단판점침",
              inferConfidence: 0.8682,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 276,
                  },
                  {
                    x: 104,
                    y: 276,
                  },
                  {
                    x: 104,
                    y: 290,
                  },
                  {
                    x: 59,
                    y: 290,
                  },
                ],
              },
              inferText: "단판불량",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 25,
                    y: 294,
                  },
                  {
                    x: 49,
                    y: 294,
                  },
                  {
                    x: 49,
                    y: 308,
                  },
                  {
                    x: 25,
                    y: 308,
                  },
                ],
              },
              inferText: "단판",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 60,
                    y: 294,
                  },
                  {
                    x: 104,
                    y: 294,
                  },
                  {
                    x: 104,
                    y: 307,
                  },
                  {
                    x: 60,
                    y: 307,
                  },
                ],
              },
              inferText: "병판요철",
              inferConfidence: 0.9571,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 70,
                    y: 312,
                  },
                  {
                    x: 95,
                    y: 312,
                  },
                  {
                    x: 95,
                    y: 326,
                  },
                  {
                    x: 70,
                    y: 326,
                  },
                ],
              },
              inferText: "갈림",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 69,
                    y: 329,
                  },
                  {
                    x: 95,
                    y: 329,
                  },
                  {
                    x: 95,
                    y: 344,
                  },
                  {
                    x: 69,
                    y: 344,
                  },
                ],
              },
              inferText: "만곡",
              inferConfidence: 0.9984,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 302,
                    y: 333,
                  },
                  {
                    x: 312,
                    y: 333,
                  },
                  {
                    x: 312,
                    y: 345,
                  },
                  {
                    x: 302,
                    y: 345,
                  },
                ],
              },
              inferText: "9",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 347,
                  },
                  {
                    x: 104,
                    y: 347,
                  },
                  {
                    x: 104,
                    y: 361,
                  },
                  {
                    x: 59,
                    y: 361,
                  },
                ],
              },
              inferText: "중판겹침",
              inferConfidence: 0.9943,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 24,
                    y: 365,
                  },
                  {
                    x: 48,
                    y: 365,
                  },
                  {
                    x: 48,
                    y: 378,
                  },
                  {
                    x: 24,
                    y: 378,
                  },
                ],
              },
              inferText: "중판",
              inferConfidence: 0.9998,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 366,
                  },
                  {
                    x: 104,
                    y: 366,
                  },
                  {
                    x: 104,
                    y: 378,
                  },
                  {
                    x: 59,
                    y: 378,
                  },
                ],
              },
              inferText: "두께불량",
              inferConfidence: 0.9994,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 383,
                  },
                  {
                    x: 104,
                    y: 383,
                  },
                  {
                    x: 104,
                    y: 396,
                  },
                  {
                    x: 59,
                    y: 396,
                  },
                ],
              },
              inferText: "중판요철",
              inferConfidence: 0.9246,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 272,
                    y: 384,
                  },
                  {
                    x: 286,
                    y: 384,
                  },
                  {
                    x: 286,
                    y: 397,
                  },
                  {
                    x: 272,
                    y: 397,
                  },
                ],
              },
              inferText: "13",
              inferConfidence: 0.9992,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 300,
                    y: 386,
                  },
                  {
                    x: 313,
                    y: 386,
                  },
                  {
                    x: 313,
                    y: 399,
                  },
                  {
                    x: 300,
                    y: 399,
                  },
                ],
              },
              inferText: "6",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 477,
                    y: 384,
                  },
                  {
                    x: 489,
                    y: 384,
                  },
                  {
                    x: 489,
                    y: 397,
                  },
                  {
                    x: 477,
                    y: 397,
                  },
                ],
              },
              inferText: "←",
              inferConfidence: 0.4737,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 508,
                    y: 387,
                  },
                  {
                    x: 524,
                    y: 387,
                  },
                  {
                    x: 524,
                    y: 397,
                  },
                  {
                    x: 508,
                    y: 397,
                  },
                ],
              },
              inferText: "31",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 49,
                    y: 400,
                  },
                  {
                    x: 85,
                    y: 400,
                  },
                  {
                    x: 85,
                    y: 414,
                  },
                  {
                    x: 49,
                    y: 414,
                  },
                ],
              },
              inferText: "기계명",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 123,
                    y: 401,
                  },
                  {
                    x: 161,
                    y: 401,
                  },
                  {
                    x: 161,
                    y: 414,
                  },
                  {
                    x: 123,
                    y: 414,
                  },
                ],
              },
              inferText: "GS 3호",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 183,
                    y: 401,
                  },
                  {
                    x: 220,
                    y: 401,
                  },
                  {
                    x: 220,
                    y: 414,
                  },
                  {
                    x: 183,
                    y: 414,
                  },
                ],
              },
              inferText: "GS 4호",
              inferConfidence: 0.9993,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 273,
                    y: 401,
                  },
                  {
                    x: 309,
                    y: 401,
                  },
                  {
                    x: 309,
                    y: 414,
                  },
                  {
                    x: 273,
                    y: 414,
                  },
                ],
              },
              inferText: "GS 3호",
              inferConfidence: 0.9996,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 332,
                    y: 401,
                  },
                  {
                    x: 369,
                    y: 401,
                  },
                  {
                    x: 369,
                    y: 414,
                  },
                  {
                    x: 332,
                    y: 414,
                  },
                ],
              },
              inferText: "GS 4호",
              inferConfidence: 0.9995,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 421,
                    y: 401,
                  },
                  {
                    x: 458,
                    y: 401,
                  },
                  {
                    x: 458,
                    y: 414,
                  },
                  {
                    x: 421,
                    y: 414,
                  },
                ],
              },
              inferText: "GS 3호",
              inferConfidence: 0.9986,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 481,
                    y: 402,
                  },
                  {
                    x: 517,
                    y: 402,
                  },
                  {
                    x: 517,
                    y: 413,
                  },
                  {
                    x: 481,
                    y: 413,
                  },
                ],
              },
              inferText: "GS 4호",
              inferConfidence: 0.98,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 240,
                    y: 411,
                  },
                  {
                    x: 252,
                    y: 411,
                  },
                  {
                    x: 252,
                    y: 422,
                  },
                  {
                    x: 240,
                    y: 422,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 0.9901,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 389,
                    y: 411,
                  },
                  {
                    x: 401,
                    y: 411,
                  },
                  {
                    x: 401,
                    y: 422,
                  },
                  {
                    x: 389,
                    y: 422,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 537,
                    y: 409,
                  },
                  {
                    x: 550,
                    y: 409,
                  },
                  {
                    x: 550,
                    y: 424,
                  },
                  {
                    x: 537,
                    y: 424,
                  },
                ],
              },
              inferText: "계",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 51,
                    y: 420,
                  },
                  {
                    x: 83,
                    y: 420,
                  },
                  {
                    x: 83,
                    y: 430,
                  },
                  {
                    x: 51,
                    y: 430,
                  },
                ],
              },
              inferText: "A/B조",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 120,
                    y: 420,
                  },
                  {
                    x: 133,
                    y: 420,
                  },
                  {
                    x: 133,
                    y: 433,
                  },
                  {
                    x: 120,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 153,
                    y: 420,
                  },
                  {
                    x: 163,
                    y: 420,
                  },
                  {
                    x: 163,
                    y: 432,
                  },
                  {
                    x: 153,
                    y: 432,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.975,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 179,
                    y: 420,
                  },
                  {
                    x: 192,
                    y: 420,
                  },
                  {
                    x: 192,
                    y: 433,
                  },
                  {
                    x: 179,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 213,
                    y: 420,
                  },
                  {
                    x: 222,
                    y: 420,
                  },
                  {
                    x: 222,
                    y: 432,
                  },
                  {
                    x: 213,
                    y: 432,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.987,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 269,
                    y: 420,
                  },
                  {
                    x: 282,
                    y: 420,
                  },
                  {
                    x: 282,
                    y: 433,
                  },
                  {
                    x: 269,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 302,
                    y: 420,
                  },
                  {
                    x: 310,
                    y: 420,
                  },
                  {
                    x: 310,
                    y: 432,
                  },
                  {
                    x: 302,
                    y: 432,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9906,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 328,
                    y: 420,
                  },
                  {
                    x: 340,
                    y: 420,
                  },
                  {
                    x: 340,
                    y: 433,
                  },
                  {
                    x: 328,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 361,
                    y: 420,
                  },
                  {
                    x: 371,
                    y: 420,
                  },
                  {
                    x: 371,
                    y: 432,
                  },
                  {
                    x: 361,
                    y: 432,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9937,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 417,
                    y: 420,
                  },
                  {
                    x: 430,
                    y: 420,
                  },
                  {
                    x: 430,
                    y: 433,
                  },
                  {
                    x: 417,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 451,
                    y: 420,
                  },
                  {
                    x: 460,
                    y: 420,
                  },
                  {
                    x: 460,
                    y: 433,
                  },
                  {
                    x: 451,
                    y: 433,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.9706,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 477,
                    y: 420,
                  },
                  {
                    x: 490,
                    y: 420,
                  },
                  {
                    x: 490,
                    y: 433,
                  },
                  {
                    x: 477,
                    y: 433,
                  },
                ],
              },
              inferText: "A",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 510,
                    y: 420,
                  },
                  {
                    x: 520,
                    y: 420,
                  },
                  {
                    x: 520,
                    y: 433,
                  },
                  {
                    x: 510,
                    y: 433,
                  },
                ],
              },
              inferText: "B",
              inferConfidence: 0.8952,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 70,
                    y: 437,
                  },
                  {
                    x: 95,
                    y: 437,
                  },
                  {
                    x: 95,
                    y: 451,
                  },
                  {
                    x: 70,
                    y: 451,
                  },
                ],
              },
              inferText: "목편",
              inferConfidence: 0.9996,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 418,
                    y: 440,
                  },
                  {
                    x: 432,
                    y: 440,
                  },
                  {
                    x: 432,
                    y: 452,
                  },
                  {
                    x: 418,
                    y: 452,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 475,
                    y: 439,
                  },
                  {
                    x: 490,
                    y: 439,
                  },
                  {
                    x: 490,
                    y: 452,
                  },
                  {
                    x: 475,
                    y: 452,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 454,
                  },
                  {
                    x: 104,
                    y: 454,
                  },
                  {
                    x: 104,
                    y: 469,
                  },
                  {
                    x: 59,
                    y: 469,
                  },
                ],
              },
              inferText: "단판겹침",
              inferConfidence: 0.9815,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 507,
                    y: 457,
                  },
                  {
                    x: 521,
                    y: 457,
                  },
                  {
                    x: 521,
                    y: 469,
                  },
                  {
                    x: 507,
                    y: 469,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 58,
                    y: 472,
                  },
                  {
                    x: 104,
                    y: 472,
                  },
                  {
                    x: 104,
                    y: 487,
                  },
                  {
                    x: 58,
                    y: 487,
                  },
                ],
              },
              inferText: "중판겹침",
              inferConfidence: 0.9899,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 58,
                    y: 490,
                  },
                  {
                    x: 104,
                    y: 490,
                  },
                  {
                    x: 104,
                    y: 504,
                  },
                  {
                    x: 58,
                    y: 504,
                  },
                ],
              },
              inferText: "단부길이",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 508,
                  },
                  {
                    x: 104,
                    y: 508,
                  },
                  {
                    x: 104,
                    y: 522,
                  },
                  {
                    x: 59,
                    y: 522,
                  },
                ],
              },
              inferText: "단부머리",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 24,
                    y: 516,
                  },
                  {
                    x: 48,
                    y: 516,
                  },
                  {
                    x: 48,
                    y: 531,
                  },
                  {
                    x: 24,
                    y: 531,
                  },
                ],
              },
              inferText: "접착",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 58,
                    y: 526,
                  },
                  {
                    x: 104,
                    y: 526,
                  },
                  {
                    x: 104,
                    y: 540,
                  },
                  {
                    x: 58,
                    y: 540,
                  },
                ],
              },
              inferText: "중부길이",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 270,
                    y: 526,
                  },
                  {
                    x: 282,
                    y: 526,
                  },
                  {
                    x: 282,
                    y: 541,
                  },
                  {
                    x: 270,
                    y: 541,
                  },
                ],
              },
              inferText: "9",
              inferConfidence: 0.9909,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 58,
                    y: 544,
                  },
                  {
                    x: 104,
                    y: 544,
                  },
                  {
                    x: 104,
                    y: 558,
                  },
                  {
                    x: 58,
                    y: 558,
                  },
                ],
              },
              inferText: "중부머리",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 562,
                  },
                  {
                    x: 104,
                    y: 562,
                  },
                  {
                    x: 104,
                    y: 575,
                  },
                  {
                    x: 59,
                    y: 575,
                  },
                ],
              },
              inferText: "병판부족",
              inferConfidence: 0.9996,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 70,
                    y: 580,
                  },
                  {
                    x: 94,
                    y: 580,
                  },
                  {
                    x: 94,
                    y: 593,
                  },
                  {
                    x: 70,
                    y: 593,
                  },
                ],
              },
              inferText: "벌림",
              inferConfidence: 0.9924,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 64,
                    y: 597,
                  },
                  {
                    x: 99,
                    y: 597,
                  },
                  {
                    x: 99,
                    y: 611,
                  },
                  {
                    x: 64,
                    y: 611,
                  },
                ],
              },
              inferText: "실자리",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 69,
                    y: 615,
                  },
                  {
                    x: 95,
                    y: 615,
                  },
                  {
                    x: 95,
                    y: 629,
                  },
                  {
                    x: 69,
                    y: 629,
                  },
                ],
              },
              inferText: "파손",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 25,
                    y: 632,
                  },
                  {
                    x: 48,
                    y: 632,
                  },
                  {
                    x: 48,
                    y: 647,
                  },
                  {
                    x: 25,
                    y: 647,
                  },
                ],
              },
              inferText: "열압",
              inferConfidence: 0.9991,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 69,
                    y: 633,
                  },
                  {
                    x: 94,
                    y: 633,
                  },
                  {
                    x: 94,
                    y: 647,
                  },
                  {
                    x: 69,
                    y: 647,
                  },
                ],
              },
              inferText: "늘림",
              inferConfidence: 0.9657,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 122,
                    y: 636,
                  },
                  {
                    x: 134,
                    y: 636,
                  },
                  {
                    x: 134,
                    y: 647,
                  },
                  {
                    x: 122,
                    y: 647,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 0.997,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 65,
                    y: 651,
                  },
                  {
                    x: 99,
                    y: 651,
                  },
                  {
                    x: 99,
                    y: 665,
                  },
                  {
                    x: 65,
                    y: 665,
                  },
                ],
              },
              inferText: "절단기",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 668,
                  },
                  {
                    x: 105,
                    y: 668,
                  },
                  {
                    x: 105,
                    y: 683,
                  },
                  {
                    x: 59,
                    y: 683,
                  },
                ],
              },
              inferText: "접불가장",
              inferConfidence: 0.9665,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 182,
                    y: 669,
                  },
                  {
                    x: 194,
                    y: 669,
                  },
                  {
                    x: 194,
                    y: 683,
                  },
                  {
                    x: 182,
                    y: 683,
                  },
                ],
              },
              inferText: "+",
              inferConfidence: 0.8534,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 212,
                    y: 673,
                  },
                  {
                    x: 221,
                    y: 673,
                  },
                  {
                    x: 221,
                    y: 682,
                  },
                  {
                    x: 212,
                    y: 682,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 23,
                    y: 685,
                  },
                  {
                    x: 48,
                    y: 685,
                  },
                  {
                    x: 48,
                    y: 701,
                  },
                  {
                    x: 23,
                    y: 701,
                  },
                ],
              },
              inferText: "수지",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 686,
                  },
                  {
                    x: 105,
                    y: 686,
                  },
                  {
                    x: 105,
                    y: 701,
                  },
                  {
                    x: 59,
                    y: 701,
                  },
                ],
              },
              inferText: "접불수포",
              inferConfidence: 0.8745,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 59,
                    y: 704,
                  },
                  {
                    x: 104,
                    y: 704,
                  },
                  {
                    x: 104,
                    y: 717,
                  },
                  {
                    x: 59,
                    y: 717,
                  },
                ],
              },
              inferText: "냉압불량",
              inferConfidence: 0.9846,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 120,
                    y: 707,
                  },
                  {
                    x: 133,
                    y: 707,
                  },
                  {
                    x: 133,
                    y: 719,
                  },
                  {
                    x: 120,
                    y: 719,
                  },
                ],
              },
              inferText: "3",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 273,
                    y: 709,
                  },
                  {
                    x: 281,
                    y: 709,
                  },
                  {
                    x: 281,
                    y: 717,
                  },
                  {
                    x: 273,
                    y: 717,
                  },
                ],
              },
              inferText: "2",
              inferConfidence: 0.999,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 300,
                    y: 707,
                  },
                  {
                    x: 312,
                    y: 707,
                  },
                  {
                    x: 312,
                    y: 721,
                  },
                  {
                    x: 300,
                    y: 721,
                  },
                ],
              },
              inferText: "3",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 65,
                    y: 722,
                  },
                  {
                    x: 99,
                    y: 722,
                  },
                  {
                    x: 99,
                    y: 737,
                  },
                  {
                    x: 65,
                    y: 737,
                  },
                ],
              },
              inferText: "연삭기",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 23,
                    y: 738,
                  },
                  {
                    x: 48,
                    y: 738,
                  },
                  {
                    x: 48,
                    y: 755,
                  },
                  {
                    x: 23,
                    y: 755,
                  },
                ],
              },
              inferText: "검사",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 69,
                    y: 740,
                  },
                  {
                    x: 94,
                    y: 740,
                  },
                  {
                    x: 94,
                    y: 755,
                  },
                  {
                    x: 69,
                    y: 755,
                  },
                ],
              },
              inferText: "빠데",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 68,
                    y: 758,
                  },
                  {
                    x: 95,
                    y: 758,
                  },
                  {
                    x: 95,
                    y: 772,
                  },
                  {
                    x: 68,
                    y: 772,
                  },
                ],
              },
              inferText: "파손",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 44,
                    y: 776,
                  },
                  {
                    x: 89,
                    y: 776,
                  },
                  {
                    x: 89,
                    y: 789,
                  },
                  {
                    x: 44,
                    y: 789,
                  },
                ],
              },
              inferText: "불량매수",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 173,
                    y: 780,
                  },
                  {
                    x: 194,
                    y: 780,
                  },
                  {
                    x: 194,
                    y: 791,
                  },
                  {
                    x: 173,
                    y: 791,
                  },
                ],
              },
              inferText: "37",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 320,
                    y: 780,
                  },
                  {
                    x: 344,
                    y: 780,
                  },
                  {
                    x: 344,
                    y: 791,
                  },
                  {
                    x: 320,
                    y: 791,
                  },
                ],
              },
              inferText: "49",
              inferConfidence: 0.9999,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 44,
                    y: 794,
                  },
                  {
                    x: 89,
                    y: 794,
                  },
                  {
                    x: 89,
                    y: 808,
                  },
                  {
                    x: 44,
                    y: 808,
                  },
                ],
              },
              inferText: "검사총량",
              inferConfidence: 0.9988,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 168,
                    y: 799,
                  },
                  {
                    x: 201,
                    y: 799,
                  },
                  {
                    x: 201,
                    y: 809,
                  },
                  {
                    x: 168,
                    y: 809,
                  },
                ],
              },
              inferText: "1060",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 306,
                    y: 797,
                  },
                  {
                    x: 343,
                    y: 797,
                  },
                  {
                    x: 343,
                    y: 809,
                  },
                  {
                    x: 306,
                    y: 809,
                  },
                ],
              },
              inferText: "3.114",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 467,
                    y: 795,
                  },
                  {
                    x: 493,
                    y: 795,
                  },
                  {
                    x: 493,
                    y: 807,
                  },
                  {
                    x: 467,
                    y: 807,
                  },
                ],
              },
              inferText: "956",
              inferConfidence: 0.8964,
              type: "NORMAL",
              lineBreak: true,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 42,
                    y: 812,
                  },
                  {
                    x: 92,
                    y: 812,
                  },
                  {
                    x: 92,
                    y: 824,
                  },
                  {
                    x: 42,
                    y: 824,
                  },
                ],
              },
              inferText: "불량율(%)",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 164,
                    y: 815,
                  },
                  {
                    x: 194,
                    y: 812,
                  },
                  {
                    x: 195,
                    y: 822,
                  },
                  {
                    x: 165,
                    y: 825,
                  },
                ],
              },
              inferText: "24",
              inferConfidence: 0.7109,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 307,
                    y: 814,
                  },
                  {
                    x: 325,
                    y: 814,
                  },
                  {
                    x: 325,
                    y: 827,
                  },
                  {
                    x: 307,
                    y: 827,
                  },
                ],
              },
              inferText: "4.",
              inferConfidence: 0.88,
              type: "NORMAL",
              lineBreak: false,
            },
            {
              valueType: "ALL",
              boundingPoly: {
                vertices: [
                  {
                    x: 325,
                    y: 812,
                  },
                  {
                    x: 343,
                    y: 812,
                  },
                  {
                    x: 343,
                    y: 824,
                  },
                  {
                    x: 325,
                    y: 824,
                  },
                ],
              },
              inferText: "78",
              inferConfidence: 1,
              type: "NORMAL",
              lineBreak: true,
            },
          ],
        },
      ],
      fileUrl: [
        "sungchang/",
        "images/",
        "66qo67CU7J28IOqwnOuwnCDsnbzsoJUg67CPIOyLnOyViDMucGRmIC0gMSAtIDE",
        "=.png",
      ].join(""),
    },
  ];

  const OCR = [...OCRdata][0];
  const Images = [...OCR.images][0];

  const tables = [...Images.tables][0];
  const cells = [...tables.cells];

  const fields = [...Images.fields];
  const values = [...fields];

  const result = cells.reduce(
    (acc, each) => {
      const key = getKey(each.rowIndex, each.columnIndex);
      // const mappingOne = mappingObject[key];
      const mappingOne = mappingObject.reduce((ACC, CUR) => {
        if (CUR[key]) {
          ACC = CUR[key];
        }
        return ACC;
      }, {});

      if (mappingOne) {
        const value = each.cellTextLines
          .map((cell) => cell.cellWords[0].inferText)
          .join("");

        if (mappingOne.field) {
          acc.fields[key] = value;
        } else {
          const newData = { ...mappingOne, value };
          acc.rows.push(newData);
        }
      }

      return acc;
    },
    { rows: [], fields: {} }
  );

  const date = values
    .reduce((acc, value, idx, arr) => {
      if (["년", "월", "일"].includes(value.inferText)) {
        let dateNumber = arr[idx - 1].inferText;
        if (parseInt(dateNumber) < 10) {
          dateNumber = `0${dateNumber}`;
        }
        acc.push(dateNumber);
      }
      return acc;
    }, [])
    .join("-");

  const dataRows = result.rows.map((each) => {
    return {
      ...each,
      spec: result.fields[each.spec],
      product: result.fields[each.product],
      date_ymd: date,
    };
  });

  // dataRows를 data DB에 넣는다
  const data_result = await query
    .insert("data_table3", dataRows)
    .onConflict(["date_ymd", "spec", "product", "team", "machine", "cd_def"])
    .merge()
    .run();

  draft.response.body = data_result;
};
