import { CacheInterceptor, CACHE_KEY_METADATA, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        // if there is no request, the incoming request is graphql, therefore bypass response caching.
        // later we can get the type of request (query/mutation) and if query get its field name, and attributes and cache accordingly. Otherwise, clear the cache in case of the request type is mutation.
        if (!request) {
            return undefined;
        }

        const { httpAdapter } = this.httpAdapterHost;
        const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
        const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

        if (!isHttpApp) {
            return undefined;
        }

        const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
        const excludePaths = [
            // Routes to be excluded
        ];

        if (isGetRequest && excludePaths.includes(httpAdapter.getRequestUrl(request))) {
            return undefined;
        }

        // to check if we really need to handle cache key manually specifies by users in routes/handlers
        if (isGetRequest && cacheMetadata) {
            return `${cacheMetadata}-${request._parsedUrl.query}`;
        }

        // invalidate cache keys started with the currentUrlPath
        const currentUrlPath = httpAdapter.getRequestUrl(request).split('?')[0];
        if (!isGetRequest) {
            setTimeout(async () => {
                const keys: string[] = await this.cacheManager.store.keys();
                keys.forEach((key) => {
                    if (key.startsWith(currentUrlPath) || currentUrlPath.startsWith(key)) {
                        this.cacheManager.del(key);
                    }
                });
            }, 0);
            return undefined;
        }

        return httpAdapter.getRequestUrl(request);
    }
}
