/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.taglibs.layout.controller.core;

import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.EntryUnit;
import org.ehcache.config.units.MemoryUnit;
import org.ehcache.jsr107.Eh107Configuration;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.executors.DefaultExecutor;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.DefaultParser;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.Parser;

import java.io.Writer;
import java.net.URL;
import java.util.Map;

import javax.cache.Cache;
import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

/**
 * Caching implementation of the TemplateEngine interface with more controls using local compiler
 */
public class LocalTemplateEngineCacheWithTier implements TemplateEngine {

    private static final long serialVersionUID = 8574215169965654726L;
    public ExecutableIdentifier compiledObject = null;
    public DefaultExecutor executor = null;

    /**
     * Execute the layout with given data and generate the complete page
     *
     * @param layoutName     Name of the layout
     * @param layoutFile     Layout file path as a URL object
     * @param data           Data required to execute the layout file
     * @param out            Output object as a writer
     * @param devMode        Whether we are running code in dev or prod (Default - false)
     * @param testLayoutFile This layout file path used when devMode is true
     */
    @Override
    public void execute(
            String layoutName,
            URL layoutFile,
            Map<String, Object> data,
            Writer out,
            boolean devMode,
            URL testLayoutFile) {
        if (executor == null && compiledObject == null) {
            if (devMode) {
                Parser parser = new DefaultParser();
                compiledObject = parser.compile(testLayoutFile);
                executor = new DefaultExecutor(data);
            } else {
                CachingProvider cachingProvider = 
                    Caching.getCachingProvider("org.ehcache.jsr107.EhcacheCachingProvider");

                // Acquire the default cache manager
                CacheManager manager = cachingProvider.getCacheManager();

                // Get the cache
                Cache<String, ExecutableIdentifier> cache = manager.getCache(
                        "layouts",
                        String.class,
                        ExecutableIdentifier.class
                );

                if (cache == null) {
                    // Create the cache
                    cache = manager.createCache("layouts",
                            Eh107Configuration.fromEhcacheCacheConfiguration(
                                    CacheConfigurationBuilder.newCacheConfigurationBuilder(
                                            String.class,
                                            ExecutableIdentifier.class,
                                            ResourcePoolsBuilder.newResourcePoolsBuilder()
                                                    .heap(10, EntryUnit.ENTRIES)
                                                    .offheap(10, MemoryUnit.MB)
                                                    .build()
                                    )
                            )
                    );
                }

                if (!cache.containsKey(layoutName)) {
                    Parser parser = new DefaultParser();
                    compiledObject = parser.compile(layoutFile);
                    cache.put(layoutName, compiledObject);
                } else {
                    compiledObject = cache.get(layoutName);
                }

                executor = new DefaultExecutor(data);
            }
        }

        compiledObject.accept(executor, out);
    }

}
