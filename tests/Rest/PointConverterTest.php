<?php

declare(strict_types=1);

namespace App\Tests\Rest;

use App\Rest\PointConverter;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;
use PHPUnit\Framework\TestCase;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class PointConverterTest extends TestCase
{
    public function testApply(): void
    {
        $pointConverter = new PointConverter();
        $request = new Request();
        $request->query->set('lat', -40);
        $request->query->set('lng', 174);
        $pointConverter->apply($request, new ParamConverter(['name' => 'point'], Point::class));
        $this->assertEquals('174 -40', (string) $request->attributes->get('point'));
    }

    public function testApplyWithoutLatLng(): void
    {
        $pointConverter = new PointConverter();
        $this->expectException(BadRequestHttpException::class);
        $pointConverter->apply(new Request(), new ParamConverter(['name' => 'point'], Point::class));
    }

    public function testSupports(): void
    {
        $pointConverter = new PointConverter();
        $this->assertTrue($pointConverter->supports(new ParamConverter(['name' => 'point'], Point::class)));
    }
}
