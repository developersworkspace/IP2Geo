import fs = require('fs');
import path = require('path');

export class IP2Geo {

    constructor(private resourcePath: string) {
    }

    public getLocationFromIP(ip) {
        return new Promise((resolve, reject) => {
            this.getBlocks().then((blocks: string[]) => {
                this.getLocations().then((locations: string[]) => {

                    let locationId = this.getLocationIdFromIP(ip, blocks);
                    let location = this.getLocationFromLocationId(locationId, locations);
                    resolve(location);
                }).catch((err: Error) => {
                    reject(err);
                });
            }).catch((err: Error) => {
                reject(err);
            });

        });
    }

    private getBlocks() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(this.resourcePath, 'GeoLiteCity-Blocks.csv'), (err: Error, data: Buffer) => {
                if (err) {
                    //reject(err);
                } else {
                    let fileContents = data.toString();

                    let blocks = fileContents.split('\n');
                    resolve(blocks);
                }
            });
        });
    }


    private getLocations() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(this.resourcePath, 'GeoLiteCity-Location.csv'), (err: Error, data: Buffer) => {
                if (err) {
                    //reject(err);
                } else {
                    let fileContents = data.toString();

                    let locations = fileContents.split('\n');
                    resolve(locations);
                }
            });
        });
    }

    private intToIP(n: number) {
        var part1 = n & 255;
        var part2 = ((n >> 8) & 255);
        var part3 = ((n >> 16) & 255);
        var part4 = ((n >> 24) & 255);

        return part4 + "." + part3 + "." + part2 + "." + part1;
    }



    private ipToInt(ip: string) {
        var ipl = 0;
        ip.split('.').forEach(function (octet) {
            ipl <<= 8;
            ipl += parseInt(octet);
        });
        return (ipl >>> 0);
    }

    private getRegexGroups(regex: RegExp, input: string) {
        var matches, output = [];
        while (matches = regex.exec(input)) {
            output.push(matches[1]);
            output.push(matches[2]);
            output.push(matches[3]);
        }

        return output;
    }

    private getLocationIdFromIP(ip: string, blocks: string[]) {
        let ipLong = this.ipToInt(ip);

        for (let i = 2; i < blocks.length; i++) {
            let m = this.getRegexGroups(/"(.*?)","(.*?)","(.*?)"/g, blocks[i]);
            let start = parseInt(m[0]);
            let end = parseInt(m[1]);
            let locationId = parseInt(m[2]);
            if (start >= ipLong && ipLong <= end) {
                return locationId;
            }
        }

        return null;
    }

    private getLocationFromLocationId(locationId, locations) {


        for (let i = 2; i < locations.length; i++) {
            let splittedLine = locations[i].split(',');
            let id = parseInt(splittedLine[0]);
            let countryCode = splittedLine[1];
            let region = splittedLine[2];
            let city = splittedLine[3];
            let postalCode = splittedLine[4];
            let latitude = splittedLine[5];
            let longitude = splittedLine[6];
            if (id == locationId) {
                return {

                    'countryCode': countryCode,
                    'city': city,
                    'postalCode': postalCode,
                    'latitude': latitude,
                    'longitude': longitude
                };
            }
        }
        return null;
    }

}
