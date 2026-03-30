export interface ColorData {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  ref: string;
}

export interface BrandData {
  name: string;
  categories: {
    [key: string]: ColorData[];
  };
}

export const BRANDS: BrandData[] = [
  {
    name: "Avian",
    categories: {
      "Standard": [
        { name: "White (190)", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "AV-190" },
        { name: "Super Black (191)", hex: "#000000", rgb: "0, 0, 0", cmyk: "0, 0, 0, 100", ref: "AV-191" },
        { name: "Ivory Tusk (Y7-004)", hex: "#F5E9D3", rgb: "245, 233, 211", cmyk: "0, 5, 14, 4", ref: "AV-Y7" },
        { name: "Dark Grey (915)", hex: "#555555", rgb: "85, 85, 85", cmyk: "0, 0, 0, 67", ref: "AV-915" },
        { name: "Candy Pink (720)", hex: "#FF99CC", rgb: "255, 153, 204", cmyk: "0, 40, 20, 0", ref: "AV-720" },
        { name: "Skyway (602)", hex: "#87CEEB", rgb: "135, 206, 235", cmyk: "43, 12, 0, 8", ref: "AV-602" },
        { name: "Telur Asin/Sea Green (776)", hex: "#A2D9CE", rgb: "162, 217, 206", cmyk: "25, 0, 5, 15", ref: "AV-776" },
        { name: "Royal Purple (661)", hex: "#7851A9", rgb: "120, 81, 169", cmyk: "29, 52, 0, 34", ref: "AV-661" },
        { name: "Fiesta (R2 006)", hex: "#E34234", rgb: "227, 66, 52", cmyk: "0, 71, 77, 11", ref: "AV-R2" },
        { name: "Azure Blue (700)", hex: "#007FFF", rgb: "0, 127, 255", cmyk: "100, 50, 0, 0", ref: "AV-700" },
        { name: "Kiwi Gold (771)", hex: "#C5E17A", rgb: "197, 225, 122", cmyk: "12, 0, 46, 12", ref: "AV-771" },
        { name: "Bright Red (735)", hex: "#FF0000", rgb: "255, 0, 0", cmyk: "0, 100, 100, 0", ref: "AV-735" }
      ],
      "Earth Tone": [
        { name: "Warm Beige", hex: "#D2B48C", rgb: "210, 180, 140", cmyk: "0, 14, 33, 18", ref: "AV-ET1" },
        { name: "Soft Grey", hex: "#D3D3D3", rgb: "211, 211, 211", cmyk: "0, 0, 0, 17", ref: "AV-ET2" },
        { name: "Taupe", hex: "#483C32", rgb: "72, 60, 50", cmyk: "0, 17, 31, 72", ref: "AV-ET3" }
      ],
      "Pastel": [
        { name: "Mint Green", hex: "#98FF98", rgb: "152, 255, 152", cmyk: "40, 0, 40, 0", ref: "AV-P03" },
        { name: "Baby Blue", hex: "#89CFF0", rgb: "137, 207, 240", cmyk: "43, 14, 0, 6", ref: "AV-P02" },
        { name: "Lavender", hex: "#E6E6FA", rgb: "230, 230, 250", cmyk: "8, 8, 0, 2", ref: "AV-P04" }
      ],
      "Bright": [
        { name: "Terracotta", hex: "#E2725B", rgb: "226, 114, 91", cmyk: "0, 50, 60, 11", ref: "AV-B03" },
        { name: "Mustard Yellow", hex: "#E1AD01", rgb: "225, 173, 1", cmyk: "0, 23, 99, 12", ref: "AV-B04" },
        { name: "Deep Teal", hex: "#008080", rgb: "0, 128, 128", cmyk: "100, 0, 0, 50", ref: "AV-B05" }
      ]
    }
  },
  {
    name: "Mowilex",
    categories: {
      "Interior": [
        { name: "E-1000 (Putih Prima)", hex: "#F4F4F4", rgb: "244, 244, 244", cmyk: "0, 0, 0, 4", ref: "MW-E1000" },
        { name: "E-3000 (Putih Pesona)", hex: "#F9F9F7", rgb: "249, 249, 247", cmyk: "0, 0, 1, 2", ref: "MW-E3000" },
        { name: "E-8000 (Putih Chrysant)", hex: "#FDFDFD", rgb: "253, 253, 253", cmyk: "0, 0, 0, 1", ref: "MW-E8000" },
        { name: "E-00A01 (Pebble)", hex: "#D1D1CB", rgb: "209, 209, 203", cmyk: "0, 0, 3, 18", ref: "MW-E00A01" },
        { name: "E-00A05 (Mercury)", hex: "#A3A3A3", rgb: "163, 163, 163", cmyk: "0, 0, 0, 36", ref: "MW-E00A05" },
        { name: "E-08815 (Magnolia)", hex: "#EBDDC1", rgb: "235, 221, 193", cmyk: "0, 6, 18, 8", ref: "MW-E08815" },
        { name: "E-8006 (Exotic Brown)", hex: "#8B5A2B", rgb: "139, 90, 43", cmyk: "0, 35, 69, 45", ref: "MW-E8006" },
        { name: "E-4046 (Off White)", hex: "#E0DED7", rgb: "224, 222, 215", cmyk: "0, 1, 4, 12", ref: "MW-E4046" },
        { name: "E-108 (Intrique)", hex: "#F5F1E6", rgb: "245, 241, 230", cmyk: "0, 2, 6, 4", ref: "MW-E108" },
        { name: "E-099 (Pearl Grey)", hex: "#B5B8B1", rgb: "181, 184, 177", cmyk: "2, 0, 4, 28", ref: "MW-E099" },
        { name: "E-091 (Viking)", hex: "#7F8C8D", rgb: "127, 140, 141", cmyk: "10, 1, 0, 45", ref: "MW-E091" },
        { name: "E-6005 (Half Silver Grey)", hex: "#C0C0C0", rgb: "192, 192, 192", cmyk: "0, 0, 0, 25", ref: "MW-E6005" },
        { name: "E-629 (Oyster)", hex: "#D2B48C", rgb: "210, 180, 140", cmyk: "0, 14, 33, 18", ref: "MW-E629" },
        { name: "E-8008 (Camel)", hex: "#C19A6B", rgb: "193, 154, 107", cmyk: "0, 20, 45, 24", ref: "MW-E8008" },
        { name: "E-8001 (Latte Brown)", hex: "#C4A484", rgb: "196, 164, 132", cmyk: "0, 16, 33, 23", ref: "MW-E8001" },
        { name: "E-070 (Saffron)", hex: "#F4C430", rgb: "244, 196, 48", cmyk: "0, 20, 80, 4", ref: "MW-E070" }
      ],
      "Exterior": [
        { name: "W-1502 (Prime White)", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "MW-W1502" },
        { name: "W-1503 (Pretty White)", hex: "#FDFDFD", rgb: "253, 253, 253", cmyk: "0, 0, 0, 1", ref: "MW-W1503" },
        { name: "W-1504 (Honeywhite)", hex: "#F1E9D2", rgb: "241, 233, 210", cmyk: "0, 3, 13, 5", ref: "MW-W1504" },
        { name: "W-1505 (Silver White)", hex: "#E0E0E0", rgb: "224, 224, 224", cmyk: "0, 0, 0, 12", ref: "MW-W1505" },
        { name: "W-1228 (Aqua Spring)", hex: "#A3B18A", rgb: "163, 177, 138", cmyk: "8, 0, 22, 31", ref: "MW-W1228" },
        { name: "W-1052 (Minty Green)", hex: "#98FF98", rgb: "152, 255, 152", cmyk: "40, 0, 40, 0", ref: "MW-W1052" },
        { name: "W-1521 (Summer Breeze Brown)", hex: "#8D7A6F", rgb: "141, 122, 111", cmyk: "0, 13, 21, 45", ref: "MW-W1521" },
        { name: "W-0527 (Milk Tea)", hex: "#C5A075", rgb: "197, 160, 117", cmyk: "0, 19, 41, 23", ref: "MW-W0527" },
        { name: "W-0524 (Caramel)", hex: "#C68E17", rgb: "198, 142, 23", cmyk: "0, 28, 88, 22", ref: "MW-W0524" },
        { name: "W-0952 (Cashmere Grey)", hex: "#B5A642", rgb: "181, 166, 66", cmyk: "0, 8, 64, 29", ref: "MW-W0952" },
        { name: "W-0954 (Armour Grey)", hex: "#777B7E", rgb: "119, 123, 126", cmyk: "6, 2, 0, 51", ref: "MW-W0954" },
        { name: "W-1425 (Light Wave Blue)", hex: "#ADD8E6", rgb: "173, 216, 230", cmyk: "25, 6, 0, 10", ref: "MW-W1425" },
        { name: "W-1427 (Navy Blue)", hex: "#000080", rgb: "0, 0, 128", cmyk: "100, 100, 0, 50", ref: "MW-W1427" },
        { name: "W-0387 (Red Earth)", hex: "#A55353", rgb: "165, 83, 83", cmyk: "0, 50, 50, 35", ref: "MW-W0387" }
      ],
      "Wood Tone": [
        { name: "503 (Walnut)", hex: "#634832", rgb: "99, 72, 50", cmyk: "0, 27, 49, 61", ref: "MW-WS503" },
        { name: "501 (Pine)", hex: "#FAD6A5", rgb: "250, 214, 165", cmyk: "0, 14, 34, 2", ref: "MW-WS501" },
        { name: "502 (Light Oak)", hex: "#C7A35F", rgb: "199, 163, 95", cmyk: "0, 18, 52, 22", ref: "MW-WS502" },
        { name: "504 (Teak)", hex: "#B18945", rgb: "177, 137, 69", cmyk: "0, 23, 61, 31", ref: "MW-WS504" },
        { name: "506 (Cherry)", hex: "#853333", rgb: "133, 51, 51", cmyk: "0, 62, 62, 48", ref: "MW-WS506" },
        { name: "508 (Dark Brown)", hex: "#4B3621", rgb: "75, 54, 33", cmyk: "0, 28, 56, 71", ref: "MW-WS508" }
      ]
    }
  },
  {
    name: "Nippon Paint",
    categories: {
      "White & Neutrals": [
        { name: "Lily White (8006)", hex: "#F4F3ED", rgb: "244, 243, 237", cmyk: "0, 0, 3, 4", ref: "NP-8006" },
        { name: "White (BS 00E55)", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "NP-00E55" },
        { name: "Orchid White (1139)", hex: "#F6F1E5", rgb: "246, 241, 229", cmyk: "0, 2, 7, 4", ref: "NP-1139" },
        { name: "Stove White (3172)", hex: "#F0EFEA", rgb: "240, 239, 234", cmyk: "0, 0, 3, 6", ref: "NP-3172" },
        { name: "White Lilac (NP OW 1050P)", hex: "#F2EDF0", rgb: "242, 237, 240", cmyk: "0, 2, 1, 5", ref: "NP-OW1050P" },
        { name: "Grey Drops (NP OW 1087P)", hex: "#E3E2DC", rgb: "227, 226, 220", cmyk: "0, 0, 3, 11", ref: "NP-OW1087P" },
        { name: "Reticent White (NP OW 1083P)", hex: "#E8E5DF", rgb: "232, 229, 223", cmyk: "0, 1, 4, 9", ref: "NP-OW1083P" },
        { name: "Silver Lake (NP OW 2156P)", hex: "#E2E4E4", rgb: "226, 228, 228", cmyk: "1, 0, 0, 11", ref: "NP-OW2156P" }
      ],
      "Blues & Greens": [
        { name: "True Blue (NP PB 1534D)", hex: "#3C6382", rgb: "60, 99, 130", cmyk: "54, 24, 0, 49", ref: "NP-PB1534D" },
        { name: "Porcelain Blue (NP PB 1526A)", hex: "#6F94B5", rgb: "111, 148, 181", cmyk: "39, 18, 0, 29", ref: "NP-PB1526A" },
        { name: "Blue Instinct (NP BGG 1571P)", hex: "#B8D6D9", rgb: "184, 214, 217", cmyk: "15, 1, 0, 15", ref: "NP-BGG1571P" },
        { name: "Aegean Sea (NP BGG 1597D)", hex: "#4A8C8C", rgb: "74, 140, 140", cmyk: "47, 0, 0, 45", ref: "NP-BGG1597D" },
        { name: "Cool Wonder (BGG 2630P)", hex: "#C3DADC", rgb: "195, 218, 220", cmyk: "11, 1, 0, 14", ref: "NP-BGG2630P" },
        { name: "Green Mile (NP BGG 1737D)", hex: "#556B2F", rgb: "85, 107, 47", cmyk: "21, 0, 56, 58", ref: "NP-BGG1737D" }
      ],
      "Reds, Pinks, Oranges": [
        { name: "Red Confetti (NP AC 2074A)", hex: "#C0392B", rgb: "192, 57, 43", cmyk: "0, 70, 78, 25", ref: "NP-AC2074A" },
        { name: "Drama Red (NP R 1288A)", hex: "#A93226", rgb: "169, 50, 38", cmyk: "0, 70, 78, 34", ref: "NP-R1288A" },
        { name: "Fire Princess (NP R 1268D)", hex: "#943126", rgb: "148, 49, 38", cmyk: "0, 67, 74, 42", ref: "NP-R1268D" },
        { name: "Crystal Pink (NPR 1306P)", hex: "#FADBD8", rgb: "250, 219, 216", cmyk: "0, 12, 14, 2", ref: "NP-R1306P" },
        { name: "Orange Torch (1131)", hex: "#E67E22", rgb: "230, 126, 34", cmyk: "0, 45, 85, 10", ref: "NP-1131" },
        { name: "Sunkissed Tomato (YO 2403A)", hex: "#E74C3C", rgb: "231, 76, 60", cmyk: "0, 67, 74, 9", ref: "NP-YO2403A" }
      ],
      "Yellows & Creams": [
        { name: "Golden Yellow (YO 1091T)", hex: "#F1C40F", rgb: "241, 196, 15", cmyk: "0, 19, 94, 5", ref: "NP-YO1091T" },
        { name: "Creamy White (5062)", hex: "#F9E79F", rgb: "249, 231, 159", cmyk: "0, 7, 36, 2", ref: "NP-5062" },
        { name: "Sweet Peach (NP YO 1019P)", hex: "#FFDAB9", rgb: "255, 218, 185", cmyk: "0, 15, 27, 0", ref: "NP-YO1019P" },
        { name: "Malted Cream (SF3302M)", hex: "#F3E5AB", rgb: "243, 229, 171", cmyk: "0, 6, 30, 5", ref: "NP-SF3302M" }
      ],
      "Grays & Darks": [
        { name: "Grey Ashes (NP N 2041P)", hex: "#BDC3C7", rgb: "189, 195, 199", cmyk: "5, 2, 0, 22", ref: "NP-N2041P" },
        { name: "Dinosaur Gray (NP N 2042P)", hex: "#95A5A6", rgb: "149, 165, 166", cmyk: "10, 1, 0, 35", ref: "NP-N2042P" },
        { name: "Hardware Gray (NP N 2031D)", hex: "#7F8C8D", rgb: "127, 140, 141", cmyk: "10, 1, 0, 45", ref: "NP-N2031D" },
        { name: "Opera Night (NP PB 1422A)", hex: "#2C3E50", rgb: "44, 62, 80", cmyk: "45, 23, 0, 69", ref: "NP-PB1422A" }
      ]
    }
  },
  {
    name: "Dana Paint",
    categories: {
      "Standard": [
        { name: "Putih/White (222-0001)", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "DP-222-0001" },
        { name: "Premium White (222-4122)", hex: "#F4F4F0", rgb: "244, 244, 240", cmyk: "0, 0, 2, 4", ref: "DP-222-4122" },
        { name: "Hitam/Black (222-0020)", hex: "#000000", rgb: "0, 0, 0", cmyk: "0, 0, 0, 100", ref: "DP-222-0020" },
        { name: "Black Doff/Matt (222-2833)", hex: "#1A1A1A", rgb: "26, 26, 26", cmyk: "0, 0, 0, 90", ref: "DP-222-2833" },
        { name: "Super Blue (222-3427)", hex: "#005A9C", rgb: "0, 90, 156", cmyk: "100, 42, 0, 39", ref: "DP-222-3427" },
        { name: "Deep Blue (222-3439)", hex: "#003366", rgb: "0, 51, 102", cmyk: "100, 50, 0, 60", ref: "DP-222-3439" },
        { name: "Marine Blue (222-5467)", hex: "#0047AB", rgb: "0, 71, 171", cmyk: "100, 58, 0, 33", ref: "DP-222-5467" },
        { name: "Merah Bata (222-4278)", hex: "#A52A2A", rgb: "165, 42, 42", cmyk: "0, 75, 75, 35", ref: "DP-222-4278" },
        { name: "Silver (222-XXXX)", hex: "#C0C0C0", rgb: "192, 192, 192", cmyk: "0, 0, 0, 25", ref: "DP-222-SILV" }
      ],
      "Interior": [
        { name: "Natural Grey (AP106-4)", hex: "#808080", rgb: "128, 128, 128", cmyk: "0, 0, 0, 50", ref: "DP-AP106" },
        { name: "Off-White (Standar)", hex: "#F5F5DC", rgb: "245, 245, 220", cmyk: "0, 0, 10, 4", ref: "DP-OFFW" },
        { name: "Pastel Grey (222-1606)", hex: "#D3D3D3", rgb: "211, 211, 211", cmyk: "0, 0, 0, 17", ref: "DP-222-1606" }
      ],
      "Wood Tone": [
        { name: "Oak", hex: "#804000", rgb: "128, 64, 0", cmyk: "0, 50, 100, 50", ref: "DP-W01" },
        { name: "Mahogany", hex: "#C04000", rgb: "192, 64, 0", cmyk: "0, 67, 100, 25", ref: "DP-W02" }
      ],
      "Custom Mix": [
        { name: "Abu Standar", hex: "#808080", rgb: "128, 128, 128", cmyk: "0, 0, 0, 50", ref: "DP-MIX-GR" },
        { name: "Abu Muda", hex: "#D3D3D3", rgb: "211, 211, 211", cmyk: "0, 0, 0, 17", ref: "DP-MIX-LGR" },
        { name: "Abu Tua", hex: "#555555", rgb: "85, 85, 85", cmyk: "0, 0, 0, 67", ref: "DP-MIX-DGR" },
        { name: "Hijau", hex: "#008000", rgb: "0, 128, 0", cmyk: "100, 0, 100, 50", ref: "DP-MIX-GN" },
        { name: "Oranye", hex: "#FFA500", rgb: "255, 165, 0", cmyk: "0, 35, 100, 0", ref: "DP-MIX-OR" },
        { name: "Krem", hex: "#F5F5DC", rgb: "245, 245, 220", cmyk: "0, 0, 10, 4", ref: "DP-MIX-CR" }
      ]
    }
  },
  {
    name: "Propan",
    categories: {
      "Custom Mix": [
        { name: "Base White", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "PR-C01" },
        { name: "Base Red", hex: "#FF0000", rgb: "255, 0, 0", cmyk: "0, 100, 100, 0", ref: "PR-C02" },
        { name: "Base Blue", hex: "#0000FF", rgb: "0, 0, 255", cmyk: "100, 100, 0, 0", ref: "PR-C03" }
      ]
    }
  },
  {
    name: "Base Colors",
    categories: {
      "Primary": [
        { name: "RYB Red", hex: "#FF0000", rgb: "255, 0, 0", cmyk: "0, 100, 100, 0", ref: "RYB-P1" },
        { name: "RYB Yellow", hex: "#FFFF00", rgb: "255, 255, 0", cmyk: "0, 0, 100, 0", ref: "RYB-P2" },
        { name: "RYB Blue", hex: "#0000FF", rgb: "0, 0, 255", cmyk: "100, 100, 0, 0", ref: "RYB-P3" }
      ],
      "Secondary": [
        { name: "RYB Orange", hex: "#FFA500", rgb: "255, 165, 0", cmyk: "0, 35, 100, 0", ref: "RYB-S1" },
        { name: "RYB Green", hex: "#008000", rgb: "0, 128, 0", cmyk: "100, 0, 100, 50", ref: "RYB-S2" },
        { name: "RYB Purple", hex: "#800080", rgb: "128, 0, 128", cmyk: "0, 100, 0, 50", ref: "RYB-S3" }
      ],
      "Tertiary": [
        { name: "Red-Orange", hex: "#FF4500", rgb: "255, 69, 0", cmyk: "0, 73, 100, 0", ref: "RYB-T1" },
        { name: "Yellow-Orange", hex: "#FFBF00", rgb: "255, 191, 0", cmyk: "0, 25, 100, 0", ref: "RYB-T2" },
        { name: "Yellow-Green", hex: "#7FFF00", rgb: "127, 255, 0", cmyk: "50, 0, 100, 0", ref: "RYB-T3" },
        { name: "Blue-Green", hex: "#008080", rgb: "0, 128, 128", cmyk: "100, 0, 0, 50", ref: "RYB-T4" },
        { name: "Blue-Purple", hex: "#4B0082", rgb: "75, 0, 130", cmyk: "42, 100, 0, 49", ref: "RYB-T5" },
        { name: "Red-Purple", hex: "#DC143C", rgb: "220, 20, 60", cmyk: "0, 91, 73, 14", ref: "RYB-T6" }
      ],
      "Neutral": [
        { name: "Absolute White", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", ref: "BASE-W" },
        { name: "Absolute Black", hex: "#000000", rgb: "0, 0, 0", cmyk: "0, 0, 0, 100", ref: "BASE-K" },
        { name: "Neutral Grey", hex: "#808080", rgb: "128, 128, 128", cmyk: "0, 0, 0, 50", ref: "BASE-GR" }
      ]
    }
  }
];

export const CATEGORIES = [
  "Standard", "Earth Tone", "Neutral", "Pastel", "Bright", "Dark", "Earthy", "Industrial", "Wood Tone", "Exterior", "Interior", "Custom Mix",
  "Primary", "Secondary", "Tertiary", "White & Neutrals", "Blues & Greens", "Reds, Pinks, Oranges", "Yellows & Creams", "Grays & Darks"
];
