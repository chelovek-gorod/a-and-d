export const state = {
    addFramesSteps: [Infinity, 300, 200, 133, 89, 59, 40, 26, 18, 12, 8, 5, 3],
    attackTimeout: 0,
    nexUnitTimeout: 0,
    waveTimeouts: [
        180 * 60,
        120 * 60,
        60 * 60,
    ],
    nexUnitDelays: [60, 40, 30],
    currentWave: 0,

    player: {
        totalOreMined : 0,
        energy: {
            used: 4, // use of energy
            max: 5,  // all energy slots
            upgrade: {
                components: 6,
                science: 3,
                rate: 2, // upgrade price rate (components and science)
            }
        },
        ore: {
            count: 0, // current source number
            used: 2, // use of energy
            add: 4, // add ore per frames index of addFramesSteps
        },
        components: {
            count: 0, // current source number
            used: 1, // use of energy
            add: 2, // add ore per frames index of addFramesSteps
        },
        science: {
            count: 0, // current source number
            used: 1, // use of energy
            add: 1, // add ore per frames index of addFramesSteps
        },
        attack: {
            bombCarrier: {
                count: 0,
                speed: 4,
                power: 15,
                armor: 5,
                price: 3,
                upgrade: {
                    price: 6,
                    speed: 0,
                    power: 3,
                    armor: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            spider: {
                count: 0,
                speed: 8,
                power: 5,
                armor: 2,
                price: 1,
                upgrade: {
                    price: 3,
                    speed: 2,
                    power: 1,
                    armor: 0,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            plane: {
                count: 0,
                speed: 12,
                power: 10,
                armor: 4,
                price: 5,
                upgrade: {
                    price: 10,
                    speed: 2,
                    power: 2,
                    armor: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            airship: {
                count: 0,
                speed: 2,
                power: 20,
                armor: 16,
                price: 7,
                upgrade: {
                    price: 12,
                    speed: 0,
                    power: 5,
                    armor: 2,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            }
        },
        defense: {
            gatling: {
                price: 8,
                ground: 5, // ground power
                air: 5,  // air power
                radius: 6,
                speed: 10, // shuts per second
                upgrade: {
                    price: 6,
                    ground: 1,
                    air: 1,
                    radius: 0,
                    speed: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            rocket: {
                price: 12,
                ground: 40, // ground power
                air: 60,  // air power
                radius: 12,
                speed: 1, // shuts per second
                upgrade: {
                    price: 8,
                    ground: 0,
                    air: 2,
                    radius: 1,
                    speed: 0.1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            tesla: {
                price: 18,
                ground: 160, // ground power
                air: 80,  // air power
                radius: 9,
                speed: 0.5, // shuts per second
                upgrade: {
                    price: 12,
                    ground: 2,
                    air: 0,
                    radius: 1,
                    speed: 0.05,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            base: {
                hp: 100,
                repair: {
                    components: 6,
                    science: 3,
                    rate: 1.5, // repair price rate (components and science)
                }
            },
        }
    },

    opponent: {
        totalOreMined : 0,
        energy: {
            used: 4, // use of energy
            max: 5,  // all energy slots
            upgrade: {
                components: 6,
                science: 3,
                rate: 2, // upgrade price rate (components and science)
            }
        },
        ore: {
            count: 0, // current source number
            used: 2, // use of energy
            add: 4, // add ore per frames index of addFramesSteps
        },
        components: {
            count: 0, // current source number
            used: 1, // use of energy
            add: 2, // add ore per frames index of addFramesSteps
        },
        science: {
            count: 0, // current source number
            used: 1, // use of energy
            add: 1, // add ore per frames index of addFramesSteps
        },
        attack: {
            bombCarrier: {
                count: 0,
                speed: 4,
                power: 15,
                armor: 5,
                price: 3,
                upgrade: {
                    price: 6,
                    speed: 0,
                    power: 3,
                    armor: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            spider: {
                count: 0,
                speed: 8,
                power: 5,
                armor: 2,
                price: 1,
                upgrade: {
                    price: 3,
                    speed: 2,
                    power: 1,
                    armor: 0,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            plane: {
                count: 0,
                speed: 12,
                power: 10,
                armor: 4,
                price: 5,
                upgrade: {
                    price: 10,
                    speed: 2,
                    power: 2,
                    armor: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            airship: {
                count: 0,
                speed: 2,
                power: 20,
                armor: 16,
                price: 7,
                upgrade: {
                    price: 12,
                    speed: 0,
                    power: 5,
                    armor: 2,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            }
        },
        defense: {
            gatling: {
                price: 8,
                ground: 5, // ground power
                air: 5,  // air power
                radius: 6,
                speed: 10, // shuts per second
                upgrade: {
                    price: 6,
                    ground: 1,
                    air: 1,
                    radius: 0,
                    speed: 1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            rocket: {
                price: 12,
                ground: 40, // ground power
                air: 60,  // air power
                radius: 12,
                speed: 1, // shuts per second
                upgrade: {
                    price: 8,
                    ground: 0,
                    air: 2,
                    radius: 1,
                    speed: 0.1,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            tesla: {
                price: 18,
                ground: 160, // ground power
                air: 80,  // air power
                radius: 9,
                speed: 0.5, // shuts per second
                upgrade: {
                    price: 12,
                    ground: 2,
                    air: 0,
                    radius: 1,
                    speed: 0.05,
                    rate: 1.2 // add round(addPrice) and add round(upgrade.price)
                }
            },
            base: {
                hp: 100,
                repair: {
                    components: 6,
                    science: 3,
                    rate: 1.5, // repair price rate (components and science)
                }
            },
        }
    },
}