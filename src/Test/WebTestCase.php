<?php

declare(strict_types=1);

namespace App\Test;

use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseWebTestCase;

abstract class WebTestCase extends BaseWebTestCase
{
    protected ?KernelBrowser $client = null;

    private ?Loader $fixtureLoader = null;

    private ?ORMExecutor $fixtureExecutor = null;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient();
        $this->addFixture(new AppFixtures());
        $this->executeFixtures();
    }

    private function addFixture(FixtureInterface $fixture): void
    {
        $this->getFixtureLoader()->addFixture($fixture);
    }

    private function executeFixtures(): void
    {
        $this->getFixtureExecutor()->execute($this->getFixtureLoader()->getFixtures());
    }

    private function getFixtureLoader(): Loader
    {
        if (!$this->fixtureLoader) {
            $this->fixtureLoader = new Loader(self::$kernel->getContainer());
        }
        return $this->fixtureLoader;
    }

    private function getFixtureExecutor(): ORMExecutor
    {
        if (!$this->fixtureExecutor) {
            $doctrine = static::getContainer()->get('doctrine');
            $entityManager = $doctrine->getManager();
            $this->fixtureExecutor = new ORMExecutor($entityManager, new ORMPurger($entityManager));
        }
        return $this->fixtureExecutor;
    }
}
