export const mockHash: "zdpuApA2CCoPHQEoP4nResbK2dq2zawFX3verNkMFmNbpDnXZ";
export const mockPath: string;
export const mockIpnsHash: "QmUTE4cxTxihntPEFqTprgbqyyS9YRaRcC8FXp6PACEjFG";
export const mockDid: string;
export const mockDocument: {
    '@context': string;
    id: string;
    created: string;
    updated: string;
    publicKey: {
        id: string;
        type: string;
        controller: string;
        publicKeyHex: string;
    }[];
    authentication: string[];
    service: {
        id: string;
        type: string;
        serviceEndpoint: string;
    }[];
};
export function createMockIpfs(): {
    isOnline: jest.Mock<boolean, []>;
    name: {
        resolve: jest.Mock<Promise<{
            path: string;
        }>, []>;
        publish: jest.Mock<Promise<void>, []>;
    };
    dag: {
        put: jest.Mock<Promise<{
            toBaseEncodedString: () => "zdpuApA2CCoPHQEoP4nResbK2dq2zawFX3verNkMFmNbpDnXZ";
        }>, []>;
        get: jest.Mock<Promise<{
            value: {
                '@context': string;
                id: string;
                created: string;
                updated: string;
                publicKey: {
                    id: string;
                    type: string;
                    controller: string;
                    publicKeyHex: string;
                }[];
                authentication: string[];
                service: {
                    id: string;
                    type: string;
                    serviceEndpoint: string;
                }[];
            };
        }>, []>;
    };
    key: {
        list: jest.Mock<Promise<{
            name: string;
        }[]>, []>;
        rm: jest.Mock<Promise<void>, [keyName?: any]>;
        import: jest.Mock<Promise<void>, [keyName?: any]>;
    };
};
export const mockPem: "\n-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQDCQZyRCPMcBPL2J2SuI2TduR7sy28wmcRzfj8fXQTbj1zJURku\ny93CIt4M6caXL29sgN2iAArLr73r2ezs+VGiCoAtIudl6qMwUG2O0hjdyiHDtCcj\nw6Ic6LVCWr6HcyShTmvRGNC6ZdONgjOHVubzoev1lqxIEVMXzCMm7RkQOwIDAQAB\nAoGBAKMi8teiingXd+tdPeI4ezbxhpUaa7CHEkJj3aL7PV8eULAI2XtBXmTxX0W8\n9jh1b7/RoU+xdV+FoZv2klCZOQHCavqryGV7ffZlETtdxz2vmBHEh04j3eBcWCod\nppFhx3jx2EhYwIh1klHj1Ybl/r3MCR6aRhER5zCMCC1XSgVxAkEA9F60bp6imTSb\n+C4CagcMiD36e+6K1CZ2refJ4T3dj88hqxjK9SKlji0aYqIK1sMNcEoeNjz6bn/u\n1TyeCteWpwJBAMuAWCQwuA/4wKFB3OERB3gsBi+9yjJqZE9b648I+uTdbP1EHGVV\niHSVHxBQjOJ/vG48GrsWDBlSKsz6txCRQE0CQQC536NMlNtGv053er+ZWF0+8C2r\nwKjWb59L7gePjRgO/9UzKDuQM9dLiqEMLwchjeGV7LqINN+j1ymaBm6L/qn3AkAI\n9h/riBGy8ltZPpNBfgR8MEQdehgbXEAKlpuq8tRJm86e4I73j2qw55g0mbd6ifF8\nUT1EG9ZwjwO/fxLssdjJAkBFTNbIqFnSkaVXIi51oXwqYl1/1h/MqoHoWdY0ZVCc\nttrI1rZSmCBbKkicdvBsJo2c916giPwGpcGIzlrt83sW\n-----END RSA PRIVATE KEY-----";
//# sourceMappingURL=index.d.ts.map