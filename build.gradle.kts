import java.net.URI
import java.net.URL

plugins {
    id("java")
    kotlin("jvm")
    kotlin("plugin.serialization") version "2.1.10"
}

group = "de.zufall.pollux"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    maven {
        url = URI("https://artifacts.alfresco.com/nexus/content/repositories/public/")
    }
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    implementation("io.modelcontextprotocol:kotlin-sdk:0.3.0")
    implementation(kotlin("stdlib-jdk8"))

    // logback
    runtimeOnly("ch.qos.logback:logback-classic:1.5.17")

    // ktor with netty
    implementation("io.ktor:ktor-server-netty:3.1.1")
    implementation("io.ktor:ktor-websockets:3.1.1")
    implementation("io.ktor:ktor-client-core:3.1.1")
    implementation("io.ktor:ktor-client-json:3.1.1")
    // cors and cachingheaders
    implementation("io.ktor:ktor-server-cio:3.1.1")
    implementation("io.ktor:ktor-server-cors:3.1.1")
    implementation("io.ktor:ktor-server-host-common:3.1.1")
    implementation("io.ktor:ktor-server-caching-headers:3.1.1")
    implementation("io.ktor:ktor-server-test-host:3.1.1")
    implementation("io.ktor:ktor-server-websockets:3.1.1")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:3.1.1")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:3.1.1")

    implementation("io.ktor:ktor-server-auth:3.1.1")
    implementation("io.ktor:ktor-server-sessions:3.1.1")

    implementation("org.activiti:activiti-bpmn-model:8.7.0")
    implementation("org.activiti:activiti-engine:8.7.0")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}