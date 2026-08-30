package gov.assam.kaac.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/public/**", "/static/**", "/css/**", "/js/**")
                .addResourceLocations(
                        "classpath:/static/public/",
                        "classpath:/static/",
                        "classpath:/static/css/",
                        "classpath:/static/js/"
                );
    }
}
