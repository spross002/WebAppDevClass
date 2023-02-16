const qs = require('querystring');
const { pathToFileURL } = require('url');


class Parser{
    constructor(schema = []){
        // key, type
        this.schema = schema;
    }

    apply_schema(payload){
        for(const item of this.schema.filter(i => payload[i.key])){
            if(item.type === 'int'){
                payload[item.key] = parseInt(payload[item.key])
            }else if(item.type === 'float'){
                payload[item.key] = parseInt(payload[item.key])
            }else if(item.type === 'bool'){
                payload[item.key] = payload[item.key] === "true"
            }
        }
        return payload
    }
}

class QueryParser extends Parser{
    constructor(schema = []){
        super(schema);
    }

    parse(req){
        if( req.url.indexOf('?') >= 0){
            const q = qs.parse(req.url.split('?')[1]);
            this.apply_schema(q);
            return q;
        }
        return {};
    }
}

class BodyParser extends Parser{
    constructor(schema = []){
        super(schema);
    }
    async parse(req){
        return new Promise((resolve, reject) => {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                body = qs.parse(body);
                try {
                    this.apply_schema(body);
                    resolve(body);
                } catch (ex) {
                    reject(ex);
                }
            });
        });
    }
}

class Matcher{
    constructor (method, path, has_query){
        this.method = method;
        this.path = path;
        this.has_query = has_query;
    }
    matches(req){
        if(req.method.toUpperCase() !== this.method.toUpperCase()) return false;
        if(this.has_query){
            return req.url.startsWith(this.path + "?");
        }else{
            return req.url === this.path;
        }
    }
}

class Route{
    constructor(matcher, handler){
        this.matcher = matcher;
        this.handler = handler;
    }
    math(req){
        return this.matcher.matches(req);
    }
    serve(req, res){
        this.handler(req, res);
    }
}

class Router{
    constructor(queryParser, bodyParser){
        this.routes = [];
        this.qp = queryParser;
        this.bp = bodyParser;
    }
    get(path, has_query, handler){
        this.routes.push(new Route(new Matcher('GET', path, has_query), handler));
    }
    post(path, has_query, handler){
        this.routes.push(new Route(new Matcher('POST', path, has_query), handler));
    }

    async on_request(req, res){
        req.query = this.qp.parse(req);
        req.body = await this.bp.parse(req);
        for(const route of this.routes){
            if(route.match(req)){
                route.serve(req, res);
                return;
            }
        }

        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('<!doctype html><html><head><title>Not Found</title></head></html>')
        res.end();
    }

}

exports.BodyParser = BodyParser;
exports.QueryParser = QueryParser;
exports.Router = Router;