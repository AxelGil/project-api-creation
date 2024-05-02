const Papa = require("papaparse");
const xml2js = require("xml2js");
const yaml = require("js-yaml");

const formaters = {
    json: { format: /(application|text)\/json.*/, formater: jsonFormater },
    csv: { format: /text\/csv/, formater: csvFormater },
    xml: { format: /(application|text)\/xml/, formater: xmlFormater },
    yaml: { format: /(application|text)\/ya?ml/, formater: yamlFormater },
};

function jsonFormater(data) {
    return JSON.stringify(data);
}

function csvFormater(data, config) {
    console.log(data);
    if(!Array.isArray(data)) data = [data];
    return Papa.unparse(data, config);
}

function xmlFormater(data, config){
    const xml = new xml2js.Builder(config.xmlBuilderOptions || {});
    return xml.buildObject(data);
}

function yamlFormater(data, config){
    return yaml.dump(data, config.yamlDumpOptions || {});
}

module.exports = function format(globalOptions = {})
{
    if(globalOptions.formaters){
        Object.assign(formaters, globalOptions.formaters);
    }

    return function (req, res, next) {
        const acceptHeader = 
        req.headers.Accept ?? req.headers.accept ?? "application/json";
    
        let formatKey = undefined;
        for(let key in formaters){
            if(formaters[key].format.test(acceptHeader)){
                formatKey = key;
                break;
            }
        }
    
        if(formatKey === undefined){
            return res.sendStatus(406);
        }
    
        res.render = function(data, callOptions = {}) {
            res.set("Content-Type", acceptHeader);
            const formater = formaters[formatKey].formater;

            const config = {
                ...(globalOptions[formatKey] ?? {}),
                ...(callOptions[formatKey] ?? {}),
            }
            res.send(formater(data, config))
        }

        next();
    };
}


