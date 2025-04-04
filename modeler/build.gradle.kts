import com.github.gradle.node.npm.task.NpmTask

plugins {
    id("java")
    id("com.github.node-gradle.node") version "7.1.0"
}

group = "de.zufall.pollux"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

node {
    version.set("20.11.1")
    npmVersion.set("10.2.3")
    download.set(true)
    workDir = layout.buildDirectory.dir("node")
    npmWorkDir = layout.buildDirectory.dir("npm")
}

tasks.register<NpmTask>("npmBuild") {
    dependsOn("npmInstall")
    npmCommand = listOf("run", "build")
}