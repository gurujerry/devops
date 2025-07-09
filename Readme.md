DevOps Presentation Demo
===

## To run Docker single container Demo
```bash
cd ./example_docker/
docker build -t currency-converter .
docker run --rm -p 8080:80 currency-converter
```
Container should be accessible on http://localhost:8080 , to stop type `Ctrl` + `c`

## To run Docker Compose Demo
```bash
cd ../example_compose/
docker-compose up --build
```
Web app container should be accessible on: http://localhost:8080 and Database container on `localhost:5432` (for direct access). To stop type `Ctrl` + `c` and to totally delete, run
```bash
docker-compose down
docker system prune -f
```

> Note: The Docker content examples were mostly generated using this [Claude AI prompt](https://claude.ai/share/cff2f79b-f94c-4989-8396-ee5f8ad8b714)

## Resources for Learning
- [TechWorld with Nana](https://www.youtube.com/@TechWorldwithNana) : Good Video's describing DevOps technologies
- [CloudPosse Github](https://github.com/cloudposse) : Lots of Terraform Examples

